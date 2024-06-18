import Config from '@constants/config';
import { FACTORY_ABI } from '@features/swap/lib/abi';
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

export function createFactoryContract(provider = createAMBProvider()) {
  return new ethers.Contract(
    '0x31A65bade6593B4fab076c6b16c338182abcC8b7',
    FACTORY_ABI,
    provider
  );
}
