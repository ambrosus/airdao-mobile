import * as Updates from 'expo-updates';

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
      stake: false,
      bridge: true
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs',
    AIRDAO_X_TWITTER_URL: 'https://twitter.com/airdao_io',
    AIRDAO_TELEGRAM_URL: 'https://t.me/airDAO_official',
    AIRDAO_MEDIUM_URL: 'https://blog.airdao.io/',
    NETWORK_URL: 'https://network.ambrosus.io',
    NFT_CONTRACT_ADDRESS: '0x4Ae225f3dC55875dc64A96fdE2835A15d3bD872a'
  },
  stage: {
    WALLET_API_URL: 'https://wallet-api.ambrosus-test.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus-test.io',
    EXPLORER_API_V2_URL: 'https://explorer-v2-api.ambrosus-test.io/v2',
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
      stake: false,
      bridge: true
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs',
    AIRDAO_X_TWITTER_URL: 'https://twitter.com/airdao_io',
    AIRDAO_TELEGRAM_URL: 'https://t.me/airDAO_official',
    AIRDAO_MEDIUM_URL: 'https://blog.airdao.io/',
    NETWORK_URL: 'https://network.ambrosus-test.io',
    NFT_CONTRACT_ADDRESS: '0x4Ae225f3dC55875dc64A96fdE2835A15d3bD872a'
  }
};

let Config = envs.prod;
if (Updates.channel === 'main') {
  Config = envs.prod;
} else if (Updates.channel === 'stage') {
  Config = envs.prod;
}

export default Config;
