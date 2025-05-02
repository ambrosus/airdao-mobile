import { Chain } from '../types';

export const EIP155_CHAINS: Record<string, Chain> = {
  '16718': {
    id: 16718,
    network: 'homestead',
    name: 'AirDAO',
    nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
    rpcUrl: 'https://network.ambrosus.io',
    blockExplorer: 'https://explorer-v2-api.ambrosus.io/v2'
  },
  '22040': {
    id: 22040,
    network: 'homestead',
    name: 'AirDAO',
    nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
    rpcUrl: 'https://network.ambrosus-test.io',
    blockExplorer: 'https://explorer-v2-api.ambrosus-test.io/v2'
  },
  '1': {
    id: 1,
    network: 'homestead',
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://ethereum.publicnode.com',
    blockExplorer: 'https://etherscan.io'
  },
  '56': {
    id: 56,
    network: 'mainnet',
    name: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com'
  },
  '97': {
    id: 97,
    network: 'homestead',
    name: 'BNB Smart Chain Testnet',
    nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    blockExplorer: 'https://testnet.bscscan.com'
  },
  '11155111': {
    id: 11155111,
    network: 'homestead',
    name: 'Sepolia Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://rpc2.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

export function extractChainData(chainId: string | number) {
  return EIP155_CHAINS[String(chainId)];
}
