import { ethers } from 'ethers';
import Config from '@constants/config';
import { FACTORY_ABI } from '@features/swap/lib/abi';

type ProviderOrSigner = ethers.providers.JsonRpcProvider | ethers.Signer;

/**
 * Creates an AMB Chain provider instance
 * @param networkUrl - @deprecated This parameter is deprecated and will be removed in the next major version.
 * Use Config.NETWORK_URL instead.
 * @returns ethers.providers.JsonRpcProvider
 */
export function createAMBProvider(networkUrl?: string) {
  return new ethers.providers.JsonRpcProvider(
    networkUrl || Config.NETWORK_URL,
    Config.CHAIN_ID
  );
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
