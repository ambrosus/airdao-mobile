export const BRIDGE_DATA = {
  prod: {
    BRIDGE_HISTORY_URL: 'https://backoffice-api.ambrosus.io',
    WSS_BRIDGE_HISTORY_URL: 'wss://backoffice-api.ambrosus.io/ws/txStatus',
    BRIDGE_RELAY_URLS: {
      relayUrls: {
        eth: 'https://relay-eth.ambrosus.io/fees',
        bsc: 'https://relay-bsc.ambrosus.io/fees'
      }
    },
    BRIDGE_CONFIG:
      'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/28ef2bb7d101581436e2fd2deba740d5698795a8/contracts/configs/main.json'
  },
  stage: {
    BRIDGE_HISTORY_URL: 'https://backoffice-api.ambrosus.io',
    WSS_BRIDGE_HISTORY_URL: 'wss://backoffice-api.ambrosus.io/ws/txStatus',

    BRIDGE_RELAY_URLS: {
      relayUrls: {
        eth: 'https://relay-eth.ambrosus.io/fees',
        bsc: 'https://relay-bsc.ambrosus.io/fees'
      }
    },
    BRIDGE_CONFIG:
      'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/28ef2bb7d101581436e2fd2deba740d5698795a8/contracts/configs/main.json'
  },
  testnet: {
    BRIDGE_HISTORY_URL: 'https://backoffice-api.ambrosus-test.io',
    WSS_BRIDGE_HISTORY_URL: 'wss://backoffice-api.ambrosus-test.io/ws/txStatus',

    BRIDGE_RELAY_URLS: {
      relayUrls: {
        eth: 'https://relay-eth.ambrosus-test.io/fees',
        bsc: 'https://relay-bsc.ambrosus-test.io/fees'
      }
    },
    BRIDGE_CONFIG:
      'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/dev/contracts/configs/test.json'
  }
};
