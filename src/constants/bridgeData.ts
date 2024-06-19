export const BRIDGE_DATA = {
  prod: {
    // bridge token exception addresses
    // token_network -> SAMB(token)_IN_AMB(network)
    SAMB_IN_AMB: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
    SAMB_IN_ETH: '0x683aae5cD37AC94943D05C19E9109D5876113562',
    SAMB2_IN_ETH: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
    WETH_IN_ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    SAMB_IN_BSC: '0x23c1C1cc14270B7Bd63677d1fe4790891b17A33d',

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
    // bridge token exception addresses
    // token_network -> SAMB(token)_IN_AMB(network): ''0x0000..
    SAMB_IN_AMB: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
    SAMB_IN_ETH: '0x683aae5cD37AC94943D05C19E9109D5876113562',
    WETH_IN_ETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    SAMB_IN_BSC: '0x23c1C1cc14270B7Bd63677d1fe4790891b17A33d',

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
    // bridge token exception addresses
    // token_network -> SAMB(token)_IN_AMB(network)
    SAMB_IN_AMB: '0x8D3e03889bFCb859B2dBEB65C60a52Ad9523512c',
    SAMB_IN_ETH: '0xcB029692aF80BB4E5B9b9A06B7587275eE1ab0cF',
    SAMB2_IN_ETH: '0xA93b86955C4dbb3210Bd4C4eD98C57a11F6f3db2',
    WETH_IN_ETH: '0x7cc041cb88D96D54B8aC4eFf8f9B83112C6748c5',
    SAMB_IN_BSC: '0xD570b2AB6efBFE296798E56D74153563E082d75c',
    WNBN_IN_BSC: '0x2ca25159d6C26633466c0DBB5e0bB07371FB30BA',

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
