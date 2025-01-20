import { ethers } from 'ethers';
import Config from '@constants/config';
import { FACTORY_ABI } from '@features/swap/lib/abi';
import { AmbErrorProvider } from '@lib';

type ProviderOrSigner = ethers.providers.JsonRpcProvider | ethers.Signer;

export function createAMBProvider() {
  if (__DEV__) return new AmbErrorProvider(Config.NETWORK_URL, Config.CHAIN_ID);

  return new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
}

export function createSigner(
  privateKey: string,
  provider = createAMBProvider()
) {
  return new ethers.Wallet(privateKey, provider);
}

export function createRouterContract(
  provider: ProviderOrSigner = createAMBProvider(),
  ABI: unknown = []
) {
  return new ethers.Contract(
    Config.ROUTER_V2_ADDRESS,
    ABI as ethers.ContractInterface,
    provider
  );
}

export function createFactoryContract(provider = createAMBProvider()) {
  return new ethers.Contract(Config.FACTORY_ADDRESS, FACTORY_ABI, provider);
}
