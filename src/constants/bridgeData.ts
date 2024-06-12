export const BRIDGE_DATA = {
  prod: {
    SAMB_IN_AMB: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
    SAMB_IN_ETH: '0x683aae5cD37AC94943D05C19E9109D5876113562',
    SAMB2_IN_ETH: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
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
    SAMB_IN_AMB: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
    SAMB_IN_ETH: '0x683aae5cD37AC94943D05C19E9109D5876113562',
    SAMB2_IN_ETH: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
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
    SAMB_IN_AMB: '0x8D3e03889bFCb859B2dBEB65C60a52Ad9523512c',
    SAMB_IN_ETH: '0xcB029692aF80BB4E5B9b9A06B7587275eE1ab0cF',
    SAMB2_IN_ETH: '0xA93b86955C4dbb3210Bd4C4eD98C57a11F6f3db2',
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
