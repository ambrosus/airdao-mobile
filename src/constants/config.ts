import * as Updates from 'expo-updates';
const envs = {
  prod: {
    CMC_API_URL: 'https://sandbox-api.coinmarketcap.com',
    WALLET_API_URL: 'https://wallet-api-api.ambrosus.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus.io',
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
    }
  },
  stage: {
    CMC_API_URL: 'https://sandbox-api.coinmarketcap.com',
    WALLET_API_URL: 'https://wallet-api.ambrosus-test.io',
    EXPLORER_API_URL: 'https://explorer-api.ambrosus-test.io',
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
    }
  }
};

let Config = envs.stage;
if (Updates.channel === 'main') {
  Config = envs.prod;
} else if (Updates.channel === 'stage') {
  Config = envs.stage;
}

export default Config;
