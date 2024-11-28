import * as Updates from 'expo-updates';

import { BRIDGE_DATA } from '@constants/bridgeData';
import { ALL_TOKENS_DATA } from '@constants/allToken';
import { SWAP_SUPPORTED_TOKENS } from '@features/swap/entities';

const envs = {
  prod: {
    WALLET_API_URL: 'https://wallet-api-api.ambrosus.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus.io/v2',
    STAKING_API_URL: 'https://staking-api.ambrosus.io/pools/v2',
    EXPLORER_URL: 'https://airdao.io/explorer',
    env: 'prod',
    debug: {
      appBuildVersion: '1.0.0',
      cryptoErrors: true,
      appErrors: false
    },
    walletActions: {
      swap: true,
      send: true,
      receive: true,
      bridge: true,
      stake: true,
      kosmos: true
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
    MARKETPLACE_URL: 'https://bond-backend-api.ambrosus.io',
    ...BRIDGE_DATA.prod,
    SWAP_TOKENS: SWAP_SUPPORTED_TOKENS.tokens.prod,
    ROUTER_V2_ADDRESS: '0xf7237C595425b49Eaeb3Dc930644de6DCa09c3C4',
    FACTORY_ADDRESS: '0x2b6852CeDEF193ece9814Ee99BE4A4Df7F463557',
    CHAIN_ID: 16718
  },
  stage: {
    WALLET_API_URL: 'https://wallet-api.ambrosus.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus.io/v2',
    STAKING_API_URL: 'https://staking-api.ambrosus.io/pools/v2',
    EXPLORER_URL: 'https://testnet.airdao.io/explorer',
    env: 'stage',
    debug: {
      appBuildVersion: '1.0.0',
      cryptoErrors: true,
      appErrors: false
    },
    walletActions: {
      swap: true,
      send: true,
      receive: true,
      bridge: true,
      stake: true,
      kosmos: true
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
    ...BRIDGE_DATA.stage,
    SWAP_TOKENS: SWAP_SUPPORTED_TOKENS.tokens.prod,
    ROUTER_V2_ADDRESS: '0xf7237C595425b49Eaeb3Dc930644de6DCa09c3C4',
    FACTORY_ADDRESS: '0x2b6852CeDEF193ece9814Ee99BE4A4Df7F463557',
    MARKETPLACE_URL: 'https://bond-backend-api.ambrosus.io',
    CHAIN_ID: 16718
  },
  testnet: {
    WALLET_API_URL: 'https://wallet-api.ambrosus-test.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus-test.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus-test.io/v2',
    STAKING_API_URL: 'https://staking-api.ambrosus-test.io/pools/v2',
    EXPLORER_URL: 'https://testnet.airdao.io/explorer',
    env: 'testnet',
    debug: {
      appBuildVersion: '1.0.0',
      cryptoErrors: true,
      appErrors: false
    },
    walletActions: {
      swap: true,
      send: true,
      receive: true,
      bridge: true,
      stake: true,
      kosmos: true
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
    ...BRIDGE_DATA.testnet,
    SWAP_TOKENS: SWAP_SUPPORTED_TOKENS.tokens.testnet,
    ROUTER_V2_ADDRESS: '0xA3E524dFc9deA66aE32e81a5E2B4DF24F56e2CBc',
    FACTORY_ADDRESS: '0x7bf4227eDfAA6823aD577dc198DbCadECccbEb07',
    MARKETPLACE_URL: 'https://bond-backend-api.ambrosus-test.io',
    CHAIN_ID: 22040
  }
};

let Config: any = envs.prod;
switch (Updates.channel) {
  case 'main': {
    Config = envs.prod;
    break;
  }
  case 'stage': {
    Config = envs.testnet;
    break;
  }
  case 'testnet': {
    Config = envs.testnet;
    break;
  }
  default: {
    Config = envs.prod;
    break;
  }
}

export default Config;
