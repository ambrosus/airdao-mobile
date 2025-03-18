import { TMainnet, TTestnet } from './types';

const MAINNET: TMainnet = {
  id: 16718,
  name: 'AirDAO Mainnet',
  nativeCurrency: {
    name: 'Amber',
    symbol: 'AMB',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.airdao.io', 'https://network.ambrosus.io']
    }
  },
  blockExplorers: {
    default: {
      name: 'AirDAO Explorer',
      url: 'https://airdao.io/explorer/'
    }
  },
  contracts: {
    multicall3: {
      address: '0x021de22a8b1B021f07a94B047AA557079BbCa6ed'
    }
  }
};

const TESTNET: TTestnet = {
  id: 22040,
  name: 'AirDAO Testnet',
  nativeCurrency: {
    name: 'Amber',
    symbol: 'AMB',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [
        'https://testnet-rpc.airdao.io',
        'https://network.ambrosus-test.io'
      ]
    }
  },
  blockExplorers: {
    default: {
      name: 'AirDAO Explorer',
      url: 'https://testnet.airdao.io/explorer/'
    }
  },
  contracts: {
    multicall3: {
      address: '0xf4FBBC66fD2B6323B7360072CDF32C0F816c9836'
    }
  },
  testnet: true
};

export { MAINNET, TESTNET };
