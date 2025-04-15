import { ethers } from 'ethers';
import { TOKEN_ADDRESSES } from './addresses';

export const SWAP_SUPPORTED_TOKENS = {
  native: {
    address: ethers.constants.AddressZero,
    name: 'AirDAO',
    symbol: 'AMB'
  },
  usdc: {
    address: TOKEN_ADDRESSES.prod.USDC,
    name: 'USDC',
    symbol: 'USDC'
  },
  tokens: {
    prod: [
      {
        address: ethers.constants.AddressZero,
        name: 'AirDAO',
        symbol: 'AMB'
      },
      {
        address: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
        name: 'USDC',
        symbol: 'USDC'
      },
      {
        address: '0x096B5914C95C34Df19500DAff77470C845EC749D',
        name: 'BOND',
        symbol: 'BOND'
      },
      {
        address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
        name: 'SAMB',
        symbol: 'SAMB'
      },
      {
        address: '0x2834C436d04ED155e736F994c1F3a0d05C4A8dE4',
        name: 'Staked AMB',
        symbol: 'stAMB'
      },
      {
        address: '0xd09270E917024E75086e27854740871F1C8E0E10',
        name: 'HBR',
        symbol: 'HBR'
      },
      {
        address: '0x5ceCBde7811aC0Ed86Be11827AE622b89Bc429DF',
        name: 'Astra',
        symbol: 'AST'
      },
      {
        address: '0xC15891E4dE2793726c20F53EcA6FB6319968E5F3',
        name: 'Kosmos Token',
        symbol: 'KOS'
      },
      {
        address: '0x5ECAddC28FcFc0bEDF94858c6D771420672ad2CF',
        name: 'X3NA',
        symbol: 'X3NA'
      }
    ],
    testnet: [
      {
        address: ethers.constants.AddressZero,
        name: 'AirDAO',
        symbol: 'AMB'
      },
      {
        address: '0xdd82283Fc93Aa4373B6B27a7B25EB3A770fc3aba',
        name: 'USDC',
        symbol: 'USDC'
      },
      {
        address: '0x765e3e03f8dfca312EfdAb378e386E1EA60ee93F',
        name: 'BOND',
        symbol: 'BOND'
      },
      {
        address: '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b',
        name: 'SAMB',
        symbol: 'SAMB'
      }
    ]
  }
};
