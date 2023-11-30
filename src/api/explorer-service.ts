/* eslint-disable camelcase */
import axios from 'axios';
import {
  ExplorerAccountDTO,
  ExplorerInfoDTO,
  Token,
  TokenDTO,
  TokenTransactionDTO,
  TransactionDTO
} from '@models';
import { ExplorerAccountType, TransactionType } from '@appTypes';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import Config from '@constants/config';
import { SearchSort } from '@screens/Search/Search.types';

const exploreApiUrl = Config.EXPLORER_API_URL;
const explorerapiV2Url = Config.EXPLORER_API_V2_URL;

const getExplorerAccountTypeFromResponseMeta = (
  search: string
): ExplorerAccountType => {
  if (search.includes('apollo')) return ExplorerAccountType.Apollo;
  else if (search.includes('atlas')) return ExplorerAccountType.Atlas;
  else if (search.includes('addresses')) return ExplorerAccountType.Atlas;
  throw Error('Given address does not belong to an account!');
};

const getExplorerInfo = async (): Promise<ExplorerInfoDTO> => {
  try {
    const response = await axios.get(`${exploreApiUrl}/info/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getExplorerAccounts = async (
  limit = 20,
  next: string,
  sort: SearchSort = SearchSort.Balance
): Promise<PaginatedResponseBody<ExplorerAccountDTO[]>> => {
  try {
    const response = await axios.get(
      `${exploreApiUrl}/accounts?limit=${limit}&sort=${sort}&next=${next}`
    );
    const nextKey = response.data.pagination.hasNext
      ? response.data.pagination.next
      : null;
    return { data: response.data.data, next: nextKey };
  } catch (error) {
    throw error;
  }
};

const searchAddress = async (address: string): Promise<ExplorerAccountDTO> => {
  try {
    const response = await axios.get(`${exploreApiUrl}/search/${address}`);
    const { meta, data } = response.data;
    const type = getExplorerAccountTypeFromResponseMeta(meta.search);
    return data.account ? { ...data.account, type } : { ...data, type };
  } catch (error) {
    throw error;
  }
};

const getTransactionDetails = async (hash: string): Promise<TransactionDTO> => {
  try {
    const response = await axios.get(`${exploreApiUrl}/search/${hash}`);
    const { data } = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

const getTransactionsOfAccount = async (
  address: string,
  page: number,
  limit: number,
  type?: TransactionType | ''
): Promise<PaginatedResponseBody<TransactionDTO[]>> => {
  try {
    if (!address) return { data: [], next: null };
    const response = await axios.get(
      `${exploreApiUrl}/accounts/${address}/transactions?page=${page}&limit=${limit}&type=${type}`
    );
    return {
      data: response.data.data,
      next: response.data.pagination.hasNext ? (page + 1).toString() : null
    };
  } catch (error) {
    throw error;
  }
};

const getTransactionsOfAccountV2 = async (
  address: string,
  page: number,
  limit: number
): Promise<
  PaginatedResponseBody<{
    tokens: Token[];
    transactions: TransactionDTO[];
  }>
> => {
  try {
    const apiUrl = `${explorerapiV2Url}/addresses/${address}/all?page=${page}&limit=${limit}`;
    const response = await axios.get(apiUrl);
    const tokens = response.data.tokens as TokenDTO[];
    const transactions = response.data.data;
    return {
      data: { tokens: tokens.map((t) => new Token(t)), transactions },
      next: response.data.pagination.hasNext ? (page + 1).toString() : null
    };
  } catch (error) {
    // TODO handle error
    throw error;
  }
};

const getTokenTransactionsV2 = async (
  address: string,
  tokenAddress: string,
  page: number,
  limit: number
): Promise<PaginatedResponseBody<TokenTransactionDTO[]>> => {
  try {
    if (!address) return { data: [], next: null };
    const apiUrl = `${explorerapiV2Url}/addresses/${address}/tokens/${tokenAddress}?limit=${limit}&page=${page}`;
    const response = await axios.get(apiUrl);
    return {
      data: response.data.data,
      // @ts-ignore
      next: response.data.pagination.hasNext ? (page + 1).toString() : null
    };
  } catch (error) {
    throw error;
  }
};

export const explorerService = {
  getExplorerInfo,
  getExplorerAccounts,
  searchAddress,
  getTransactionsOfAccount,
  getTransactionDetails,
  getTransactionsOfAccountV2: getTransactionsOfAccountV2,
  getTokenTransactionsV2
};
