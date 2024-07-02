import * as Updates from 'expo-updates';
import { BRIDGE_DATA } from '@constants/bridgeData';
import { ALL_TOKENS_DATA } from '@constants/allToken';

const envs = {
  prod: {
    WALLET_API_URL: 'https://wallet-api-api.ambrosus.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus.io/v2',
    STAKING_API_URL: 'https://staking-api.ambrosus.io/pools/v2',
    env: 'prod',
    debug: {
      appBuildVersion: '1.0.0',
      cryptoErrors: true,
      appErrors: false
    },
    walletActions: {
      swap: false,
      send: true,
      receive: true,
      bridge: true,
      stake: true
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs',
    AIRDAO_X_TWITTER_URL: 'https://twitter.com/airdao_io',
    AIRDAO_TELEGRAM_URL: 'https://t.me/airdao',
    AIRDAO_MEDIUM_URL: 'https://blog.airdao.io/',
    NETWORK_URL: 'https://network.ambrosus.io',
    ETH_NETWORK_URL: 'https://eth.llamarpc.com',
    BSC_NETWORK_URL: 'https://bsc.llamarpc.com',
    NFT_CONTRACT_ADDRESS: '0x4Ae225f3dC55875dc64A96fdE2835A15d3bD872a',
    POOL_STORE_CONTRACT_ADDRESS: '0xfC4CFa1735e13EdC30BE9eA894F2d0bb584ab642',
    ALL_TOKENS: ALL_TOKENS_DATA.PROD,
    ...BRIDGE_DATA.prod
  },
  stage: {
    WALLET_API_URL: 'https://wallet-api.ambrosus.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus.io/v2',
    STAKING_API_URL: 'https://staking-api.ambrosus.io/pools/v2',
    env: 'stage',
    debug: {
      appBuildVersion: '1.0.0',
      cryptoErrors: true,
      appErrors: false
    },
    walletActions: {
      swap: false,
      send: true,
      receive: true,
      bridge: true,
      stake: true
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs',
    AIRDAO_X_TWITTER_URL: 'https://twitter.com/airdao_io',
    AIRDAO_TELEGRAM_URL: 'https://t.me/airdao',
    AIRDAO_MEDIUM_URL: 'https://blog.airdao.io/',
    NETWORK_URL: 'https://network.ambrosus.io',
    ETH_NETWORK_URL: 'https://eth.llamarpc.com',
    BSC_NETWORK_URL: 'https://bsc.llamarpc.com',
    NFT_CONTRACT_ADDRESS: '0x4Ae225f3dC55875dc64A96fdE2835A15d3bD872a',
    POOL_STORE_CONTRACT_ADDRESS: '0xfC4CFa1735e13EdC30BE9eA894F2d0bb584ab642',
    ALL_TOKENS: ALL_TOKENS_DATA.PROD,
    ...BRIDGE_DATA.stage
  },
  testnet: {
    WALLET_API_URL: 'https://wallet-api.ambrosus-test.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus-test.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus-test.io/v2',
    STAKING_API_URL: 'https://staking-api.ambrosus-test.io/pools/v2',
    env: 'testnet',
    debug: {
      appBuildVersion: '1.0.0',
      cryptoErrors: true,
      appErrors: false
    },
    walletActions: {
      swap: false,
      send: true,
      receive: true,
      bridge: true,
      stake: true
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs',
    AIRDAO_X_TWITTER_URL: 'https://twitter.com/airdao_io',
    AIRDAO_TELEGRAM_URL: 'https://t.me/airdao',
    AIRDAO_MEDIUM_URL: 'https://blog.airdao.io/',
    NETWORK_URL: 'https://network.ambrosus-test.io',
    ETH_NETWORK_URL: 'https://ethereum-sepolia-rpc.publicnode.com',
    BSC_NETWORK_URL: 'https://bsc-testnet.public.blastapi.io',
    POOL_STORE_CONTRACT_ADDRESS: '0x282e57a4581493617029B8945824C156e599e4e0',
    NFT_CONTRACT_ADDRESS: '0x4Ae225f3dC55875dc64A96fdE2835A15d3bD872a',
    ALL_TOKENS: ALL_TOKENS_DATA.TESTNET,
    ...BRIDGE_DATA.testnet
  }
};

let Config: any = envs.prod;
switch (Updates.channel) {
  case 'main': {
    Config = envs.prod;
    break;
  }
  case 'stage': {
    Config = envs.prod;
    break;
  }
  case 'testnet': {
    Config = envs.testnet;
    break;
  }
  default: {
    Config = envs.testnet;
    break;
  }
}

export default Config;
