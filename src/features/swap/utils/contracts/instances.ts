import Config from '@constants/config';
import { ethers } from 'ethers';

export function createAMBProvider() {
  return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
}

export function createSigner(
  privateKey: string,
  provider = createAMBProvider()
) {
  return new ethers.Wallet(privateKey, provider);
}

export function createRouterContract(provider = createAMBProvider()) {
  return new ethers.Contract(Config.ROUTER_V2_ADDRESS, [], provider);
}
