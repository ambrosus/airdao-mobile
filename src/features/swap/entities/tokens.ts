import { ethers } from 'ethers';

export const SWAP_SUPPORTED_TOKENS = {
  native: {
    address: ethers.constants.AddressZero,
    name: 'AirDAO',
    symbol: 'AMB'
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
        address: '0x48437113D6d4808bD281F50eEe4b87D4c58D2557',
        name: 'Airdoge',
        symbol: 'ADOGE'
      },
      {
        address: '0x2834C436d04ED155e736F994c1F3a0d05C4A8dE4',
        name: 'Staked AMB',
        symbol: 'stAMB'
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
