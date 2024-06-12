import Config from '@constants/config';
import { ethers } from 'ethers';

export function createRouterContract(provider: any) {
  return new ethers.Contract(Config.ROUTER_V2_ADDRESS, [], provider);
}
