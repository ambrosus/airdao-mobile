import { ethers } from 'ethers';
import Config from '@constants/config';
import { rpcErrorHandler } from '@features/browser/utils';

export const ethGetTransactionByHash = async (hash: string) => {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  try {
    return await provider.getTransaction(hash);
  } catch (error) {
    rpcErrorHandler('getTransactionByHash', error);
    return null;
  }
};

export const ethGetTransactionReceipt = async (hash: string) => {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  try {
    return await provider.getTransactionReceipt(hash);
  } catch (error) {
    rpcErrorHandler('getTransactionReceipt', error);
    return null;
  }
};
