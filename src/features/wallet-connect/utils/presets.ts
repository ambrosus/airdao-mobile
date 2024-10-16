import { Chain } from '../types';

export const EIP155_CHAINS: Record<string, Chain> = {
  '16718': {
    id: 16718,
    network: 'homestead',
    name: 'AirDAO',
    nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
    rpcUrl: 'https://network.ambrosus-test.io',
    blockExplorer: 'https://explorer-v2-api.ambrosus.io/v2'
  },
  '22040': {
    id: 16718,
    network: 'homestead',
    name: 'AirDAO',
    nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
    rpcUrl: 'https://network.ambrosus.io',
    blockExplorer: 'https://explorer-v2-api.ambrosus-test.io/v2'
  }
};

export function extractChainData(chainId: string | number) {
  return EIP155_CHAINS[String(chainId)];
}
