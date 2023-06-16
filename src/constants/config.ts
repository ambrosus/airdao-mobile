import * as Updates from 'expo-updates';

const Config = {
  CMC_API_URL: 'https://sandbox-api.coinmarketcap.com',
  EXPLORER_API_URL: 'https://explorer-api.ambrosus.io',
  WALLET_API_URL: 'https://wallet-api.ambrosus.io'
};
if (Updates.channel === 'main') {
  Config.WALLET_API_URL = 'https://wallet-api-api.ambrosus.io';
  Config.EXPLORER_API_URL = 'https://explorer-api.ambrosus.io';
} else if (Updates.channel === 'stage') {
  Config.WALLET_API_URL = 'https://wallet-api.ambrosus-test.io';
  Config.EXPLORER_API_URL = 'https://explorer-api.ambrosus-test.io';
}

export default Config;
