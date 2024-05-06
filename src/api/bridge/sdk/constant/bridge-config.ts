export const config = {
  bridges: {
    eth: {
      amb: '0x19caBC1E34Ab0CC5C62DaA1394f6022B38b75c78',
      side: '0x0De2669e8A7A6F6CC0cBD3Cf2D1EEaD89e243208'
    },
    bsc: {
      amb: '0xe10eB55f6EeF66218BbE58B749428ec4A51D6659',
      side: '0x92fa52d3043725D00Eab422440C4e9ef3ba180d3'
    }
  },
  tokens: {
    SAMB: {
      isActive: true,
      name: 'Synthetic Amber',
      symbol: 'SAMB',
      logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
      networks: {
        amb: {
          address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
          denomination: 18,
          isPrimary: true,
          nativeCoin: 'AMB'
        },
        bsc: {
          address: '0x23c1C1cc14270B7Bd63677d1fe4790891b17A33d',
          denomination: 18,
          isPrimary: false
        },
        eth: {
          address: '0x683aae5cD37AC94943D05C19E9109D5876113562',
          denomination: 18,
          isPrimary: false
        }
      }
    },
    SAMB2: {
      isActive: true,
      name: 'AirDAO',
      symbol: 'AMB',
      logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
      networks: {
        amb: {
          address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
          denomination: 18,
          isPrimary: true,
          nativeCoin: 'AMB'
        },
        bsc: {
          address: '',
          denomination: 18,
          isPrimary: false
        },
        eth: {
          address: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
          denomination: 18,
          isPrimary: false
        }
      }
    },
    WETH: {
      isActive: false,
      name: 'Wrapped Ether',
      symbol: 'WETH',
      logo: 'https://ethereum.org/static/bfc04ac72981166c740b189463e1f74c/448ee/eth-diamond-black-white.webp',
      networks: {
        amb: {
          address: '0xe7c3607474E235Ec8deF1f0a63Ea983538eea182',
          denomination: 18,
          isPrimary: false
        },
        eth: {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          denomination: 18,
          isPrimary: true,
          nativeCoin: 'ETH'
        }
      }
    },
    WBNB: {
      isActive: false,
      name: 'Wrapped BNB',
      symbol: 'WBNB',
      logo: 'https://bscscan.com/token/images/binance_32.png',
      networks: {
        amb: {
          address: '0xA96C522fA8Df99BB73A6E317A1afb0E3FA13b735',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
          denomination: 18,
          isPrimary: true,
          nativeCoin: 'BNB'
        }
      }
    },
    USDC: {
      isActive: true,
      name: 'USD Coin',
      symbol: 'USDC',
      logo: 'https://etherscan.io/token/images/centre-usdc_28.png',
      networks: {
        amb: {
          address: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
          denomination: 18,
          isPrimary: true
        },
        eth: {
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          denomination: 6,
          isPrimary: true
        }
      }
    },
    BUSD: {
      isActive: true,
      name: 'BUSD Token',
      symbol: 'BUSD',
      logo: 'https://bscscan.com/token/images/busd_32.png',
      networks: {
        amb: {
          address: '0x7A477aA8ED4884509387Dba81BA6F2B7C97597e2',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
          denomination: 18,
          isPrimary: true
        }
      }
    },
    USDT: {
      isActive: true,
      name: 'Tether USD',
      symbol: 'USDT',
      logo: 'https://etherscan.io/token/images/tether_32.png',
      networks: {
        amb: {
          address: '0xfEE01F2D120250A0a59bfbF9C144F8ECC4425fCc',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0x55d398326f99059fF775485246999027B3197955',
          denomination: 18,
          isPrimary: true
        },
        eth: {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          denomination: 6,
          isPrimary: true
        }
      }
    }
  },
  ambFaucetAddress: '0x5B72903b7D2711134DD2120Bc3CA61DB6f10cB92'
};
