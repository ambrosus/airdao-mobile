import { ethers } from 'ethers';

export const TOKEN_ADDRESSES = {
  testnet: {
    SAMB: '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b',
    USDC: '0xdd82283Fc93Aa4373B6B27a7B25EB3A770fc3aba',
    BOND: '0x765e3e03f8dfca312EfdAb378e386E1EA60ee93F',
    AMB: ethers.constants.AddressZero
  },
  prod: {
    SAMB: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
    USDC: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
    BOND: '0x096B5914C95C34Df19500DAff77470C845EC749D',
    AMB: ethers.constants.AddressZero
  }
};
