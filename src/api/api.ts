import axios from 'axios';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import { ExplorerAccountType, TransactionType } from '@appTypes/enums';
import { AMBTokenDTO, ExplorerAccountDTO, ExplorerInfoDTO } from '@models/dtos';
import { TransactionDTO } from '@models/dtos/TransactionDTO';
import { ExplorerSort } from '@screens/Search/Search.types';
import { Cache, CacheKey } from '@utils/cache';

const walletAPI = 'https://wallet-api-api.ambrosus-dev.io';

const getExplorerAccountTypeFromResponseMeta = (
  search: string
): ExplorerAccountType => {
  if (search.includes('apollo')) return ExplorerAccountType.Apollo;
  else if (search.includes('atlas')) return ExplorerAccountType.Atlas;
  else if (search.includes('addresses')) return ExplorerAccountType.Atlas;
  throw Error('Given address does not belong to an account!');
};

export const getAMBTokenData = async (): Promise<AMBTokenDTO> => {
  try {
    const response = await axios.get('https://token.ambrosus.io/');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getExplorerInfo = async (): Promise<ExplorerInfoDTO> => {
  try {
    const response = await axios.get('https://explorer-api.ambrosus.io/info/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExplorerAccounts = async (
  limit = 20,
  sort: ExplorerSort = ExplorerSort.Balance
): Promise<ExplorerAccountDTO[]> => {
  try {
    const response = await axios.get(
      `https://explorer-api.ambrosus.io/accounts?limit=${limit}&sort=${sort}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const searchAddress = async (
  address: string
): Promise<ExplorerAccountDTO> => {
  try {
    const response = await axios.get(
      `https://explorer-api.ambrosus.io/search/${address}`
    );
    const { meta, data } = response.data;
    const type = getExplorerAccountTypeFromResponseMeta(meta.search);
    return data.account ? { ...data.account, type } : { ...data, type };
  } catch (error) {
    throw error;
  }
};

export const getTransactionsOfAccount = async (
  address: string,
  page: number,
  limit: number,
  type?: TransactionType | ''
): Promise<PaginatedResponseBody<TransactionDTO[]>> => {
  try {
    if (!address) return { data: [], next: null };
    const response = await axios.get(
      `https://explorer-api.ambrosus.io/accounts/${address}/transactions?page=${page}&limit=${limit}&type=${type}`
    );
    const nextUrl = response.data.pagination.hasNext
      ? `https://explorer-api.ambrosus.io/accounts/${address}/transactions?page=${
          page + 1
        }&limit=${limit}&type=${type}`
      : null;
    return { data: response.data.data, next: nextUrl };
  } catch (error) {
    throw error;
  }
};

export const watchAddress = async (address: string): Promise<void> => {
  const pushToken = await Cache.getItem(CacheKey.NotificationToken);
  if (!address || !pushToken) return;
  try {
    await axios.post(`${walletAPI}/api/v1/watcher`, {
      address,
      // eslint-disable-next-line camelcase
      push_token: pushToken
    });
  } catch (error) {
    throw error;
  }
};

export const API = {
  watchAddress,
  getAMBTokenData,
  getExplorerInfo,
  getExplorerAccounts,
  searchAddress,
  getTransactionsOfAccount
};
