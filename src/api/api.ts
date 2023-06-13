/* eslint-disable camelcase */
import axios from 'axios';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import { ExplorerAccountType, TransactionType } from '@appTypes/enums';
import { AMBTokenDTO, ExplorerAccountDTO, ExplorerInfoDTO } from '@models/dtos';
import { TransactionDTO } from '@models/dtos/TransactionDTO';
import { SearchSort } from '@screens/Search/Search.types';
import { CMCChartData, CMCInterval } from '@appTypes';
import { AMBToken } from '@models';
import { watcherService } from './watcher-service';

const CMC_API = 'https://sandbox-api.coinmarketcap.com';
// const CMC_API =
//   'https://pro-api.coinmarketcap.com';

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
  sort: SearchSort = SearchSort.Balance
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

export const getAMBPriceHistoricalPricing = async (
  interval: CMCInterval
): Promise<AMBToken[]> => {
  try {
    const res = await axios.get(
      `${CMC_API}/v3/cryptocurrency/quotes/historical?id=2081&interval=${interval}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
        }
      }
    );
    const chartData: CMCChartData = res.data?.data;
    const mappedData = chartData['2081'].quotes.map((quote) =>
      AMBToken.fromCMCResponse(quote)
    );
    return mappedData;
  } catch (error) {
    throw error;
  }
};

export const API = {
  getAMBTokenData,
  getExplorerInfo,
  getExplorerAccounts,
  searchAddress,
  getTransactionsOfAccount,
  watcherService
};
