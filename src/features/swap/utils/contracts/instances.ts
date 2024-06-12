import Config from '@constants/config';
import { Signer, ethers } from 'ethers';

export function createRouterContract(provider) {
  return new ethers.Contract(Config.ROUTER_V2_ADDRESS, [], provider);
}
