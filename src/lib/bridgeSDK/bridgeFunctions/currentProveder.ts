import { ethers } from 'ethers';
import Config from '@constants/config';

export async function currentProvider(from: string) {
  switch (from) {
    case 'eth':
      return new ethers.providers.JsonRpcProvider(Config.ETH_NETWORK_URL);
    case 'amb':
      return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    case 'bsc':
      return new ethers.providers.JsonRpcProvider(Config.BSC_NETWORK_URL);
    default:
      return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  }
}
