import { ethers } from 'ethers';
import Config from '@constants/config';
import { rpcErrorHandler } from '@features/browser/utils';

export const ethGetBlockNumber = async () => {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  try {
    return await provider.getBlockNumber();
  } catch (error) {
    rpcErrorHandler('getBlockNumber', error);
    return null;
  }
};
