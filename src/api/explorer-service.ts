/* eslint-disable camelcase */
import axios from 'axios';
import {
  ExplorerAccountDTO,
  ExplorerInfoDTO,
  Token,
  TokenDTO,
  TransactionDTO
} from '@models';
import { TransactionType } from '@appTypes';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import Config from '@constants/config';
import { SearchSort } from '@screens/Search/Search.types';
// deprecated
// const exploreApiUrl = Config.EXPLORER_API_URL;
const explorerApiV2Url = Config.EXPLORER_API_V2_URL;
const getExplorerInfo = async (): Promise<ExplorerInfoDTO> => {
  const url = `${explorerApiV2Url}/info`;
  try {
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getExplorerAccounts = async (
  limit = 20,
  page: string | number,
  sort: SearchSort = SearchSort.Balance
): Promise<PaginatedResponseBody<ExplorerAccountDTO[]>> => {
  const url = `${explorerApiV2Url}/addresses?limit=${limit}&sort=${sort}&page=${page}`;
  try {
    const response = await axios.get(url);
    const nextKey = response.data.pagination.hasNext
      ? response.data.pagination.next
      : null;
    return { data: response.data.data, next: nextKey };
  } catch (error) {
    throw error;
  }
};

const searchAddress = async (address: string): Promise<ExplorerAccountDTO> => {
  const url = `${explorerApiV2Url}/addresses/${address}/all`;
  try {
    const response = await axios.get(url);
    return response.data.account;
  } catch (error) {
    throw error;
  }
};
const getTransactionDetails = async (hash: string): Promise<TransactionDTO> => {
  const url = `${explorerApiV2Url}/transactions/${hash}`;
  try {
    const response = await axios.get(url);
    const { data } = response.data;
    return data[0];
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
  const url = `${explorerApiV2Url}/addresses/${address}/all?page=${page}&limit=${limit}&type=${type}`;
  try {
    if (!address) return { data: [], next: null };
    const response = await axios.get(url);
    const transactions = response.data.data;
    return {
      data: transactions,
      next: response.data.pagination.hasNext ? (page + 1).toString() : null
    };
  } catch (error) {
    throw error;
  }
};

const getTransactionsOfOwnAccount = async (
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
    const apiUrl = `${explorerApiV2Url}/addresses/${address}/all?page=${page}&limit=${limit}`;
    const response = await axios.get(apiUrl);
    const tokens = response.data.tokens as TokenDTO[];
    const transactions = response.data.data;
    return {
      data: {
        tokens: tokens.map((t) => new Token(t)),
        transactions
      },
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
): Promise<PaginatedResponseBody<TransactionDTO[]>> => {
  try {
    if (!address) return { data: [], next: null };
    const apiUrl = `${explorerApiV2Url}/addresses/${address}/tokens/${tokenAddress}?limit=${limit}&page=${page}`;
    const response = await axios.get(apiUrl);
    return {
      data: response.data.data,
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
  getTransactionsOfOwnAccount,
  getTokenTransactionsV2
};
