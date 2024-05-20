export const testConfig = {
  bridges: {
    eth: {
      amb: '0xC54450028dAE52c1DC1bb9Dabe553457eABd4Aa3',
      side: '0x0B64e989491A5f0e435F0c7f5cFA212f3Ce4a6f9'
    },
    bsc: {
      amb: '0x1D335E8B7787fB6c51F98713df5BCb56884FD023',
      side: '0x68fE45c5a95aF1Ab697935697C40c7c06aC600eC'
    }
  },
  ambFaucetAddress: '0xe208a39e3F988f1565628457F17E9Aa469B78F76',
  tokens: {
    SAMB: {
      isActive: true,
      name: 'Synthetic Amber',
      symbol: 'SAMB',
      logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
      networks: {
        amb: {
          address: '0x3c80Eb9ebe759F28Ae6f366275A9e2A9FE341b0a',
          denomination: 18,
          isPrimary: true,
          nativeCoin: 'AMB'
        },
        bsc: {
          address: '0x97197b41749340268DFa5Ac2CDf6a4AC3cC505e9',
          denomination: 18,
          isPrimary: false
        },
        eth: {
          address: '0x1CE24855341425b05F1bB548c013fD5a1e2f6631',
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
          address: '0x3c80Eb9ebe759F28Ae6f366275A9e2A9FE341b0a',
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
          address: '0x9d95Ce4fCE159E16d52aD5b35ac6eb993D8Efe34',
          denomination: 18,
          isPrimary: false
        }
      }
    },
    WETH: {
      isActive: true,
      name: 'Wrapped Ether',
      symbol: 'WETH',
      logo: 'https://ethereum.org/static/bfc04ac72981166c740b189463e1f74c/448ee/eth-diamond-black-white.webp',
      networks: {
        amb: {
          address: '0xdd82283Fc93Aa4373B6B27a7B25EB3A770fc3aba',
          denomination: 18,
          isPrimary: false
        },
        eth: {
          address: '0x5ECfeaD3d77F6814D189F6209ea27eCD1c00D45a',
          denomination: 18,
          isPrimary: true,
          nativeCoin: 'ETH'
        }
      }
    },
    WBNB: {
      isActive: true,
      name: 'Wrapped BNB',
      symbol: 'WBNB',
      logo: 'https://bscscan.com/token/images/binance_32.png',
      networks: {
        amb: {
          address: '0x160fb9e3a978F44c5E7fd82b17aAe27773e5b58D',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0x3050A5cBe1ec89917933476a99962A40e802B89C',
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
          address: '0xe5A673b4BfCc7c6804185F35b94693b4CAfCF43c',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0xb345925B1CA8E9646811F40d55C15eaB9fe98247',
          denomination: 18,
          isPrimary: true
        },
        eth: {
          address: '0xa4d27f0404d33f82D9955D928b4577036303dA60',
          denomination: 6,
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
          address: '0xd0322ae33ff5E14E4F200a2AAd57748F0899FAD9',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0x3D37429A3b25fCe6dc2Bb1772f308Bf394589712',
          denomination: 18,
          isPrimary: true
        },
        eth: {
          address: '0x6032372039E6B6eab140576eD88e4250a5B9DbA2',
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
          address: '0x220bB4D0d16AA509D126907d3fAe4EF55bE7316C',
          denomination: 18,
          isPrimary: false
        },
        bsc: {
          address: '0xf679a28086Eba9C72285481a19f32FCC950EfAe4',
          denomination: 18,
          isPrimary: true
        }
      }
    }
  }
};
