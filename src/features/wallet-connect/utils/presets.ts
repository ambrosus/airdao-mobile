import { Chain } from '../types';

export const EIP155_CHAINS: Record<string, Chain> = {
  '1': {
    id: 1,
    network: 'homestead',
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://cloudflare-eth.com',
    blockExplorer: 'https://etherscan.io'
  },
  '16718': {
    id: 16718,
    network: 'homestead',
    name: 'AirDAO',
    nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
    rpcUrl: 'https://network.ambrosus.io',
    blockExplorer: 'https://explorer-api.ambrosus.io'
  }
};

export function extractChainData(chainId: string | number) {
  return EIP155_CHAINS[String(chainId)];
}
