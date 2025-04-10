import { ethers } from 'ethers';
import Config from '@constants/config';
import { rpcErrorHandler } from '@features/browser/utils';

export const ethGetBlockNumber = async () => {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  try {
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  } catch (error) {
    rpcErrorHandler('getBlockNumber', error);
    return null;
  }
};

export const ethBlockNumber = async () => {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  return provider.blockNumber;
};
