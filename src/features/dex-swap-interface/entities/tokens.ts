import { TokenList } from '@features/dex-swap-interface/types';

export const DEX_SUPPORTED_TOKENS: TokenList = {
  keywords: ['airdao', 'default'],
  name: 'AirDAO Finance Default List',
  tokens: {
    prod: [
      {
        address: '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
        chainId: 22040,
        decimals: 18,
        logoURI: '',
        name: 'Ambrosus',
        symbol: 'AMB'
      },
      {
        address: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
        chainId: 22040,
        decimals: 18,
        logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
        name: 'USDC',
        symbol: 'USDC'
      },
      {
        address: '0x096B5914C95C34Df19500DAff77470C845EC749D',
        chainId: 22040,
        decimals: 18,
        logoURI: '',
        name: 'BOND',
        symbol: 'BOND'
      },
      {
        address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
        chainId: 22040,
        decimals: 18,
        logoURI: '',
        name: 'SAMB',
        symbol: 'SAMB'
      }
    ],
    testnet: [
      {
        address: '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
        chainId: 22040,
        decimals: 18,
        logoURI: '',
        name: 'Ambrosus',
        symbol: 'AMB'
      },
      {
        address: '0xdd82283Fc93Aa4373B6B27a7B25EB3A770fc3aba',
        chainId: 22040,
        decimals: 18,
        logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
        name: 'USDC',
        symbol: 'USDC'
      },
      {
        address: '0x765e3e03f8dfca312EfdAb378e386E1EA60ee93F',
        chainId: 22040,
        decimals: 18,
        logoURI: '',
        name: 'BOND',
        symbol: 'BOND'
      },
      {
        address: '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b',
        chainId: 22040,
        decimals: 18,
        logoURI: '',
        name: 'SAMB',
        symbol: 'SAMB'
      }
    ]
  },
  version: { major: 1, minor: 0, patch: 1 }
};
