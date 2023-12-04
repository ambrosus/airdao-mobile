import * as Updates from 'expo-updates';
const envs = {
  prod: {
    CMC_API_URL: 'https://sandbox-api.coinmarketcap.com',
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
      stake: false
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs'
  },
  stage: {
    CMC_API_URL: 'https://sandbox-api.coinmarketcap.com',
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
      stake: false
    },
    AIRDAO_FAQ_URL: 'https://airdao.academy/faqs'
  }
};

let Config = envs.prod;
if (Updates.channel === 'main') {
  Config = envs.prod;
} else if (Updates.channel === 'stage') {
  Config = envs.stage;
}

export default Config;
