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
    STAMB: '0x2834C436d04ED155e736F994c1F3a0d05C4A8dE4',
    USDC: '0xFF9F502976E7bD2b4901aD7Dd1131Bb81E5567de',
    BOND: '0x096B5914C95C34Df19500DAff77470C845EC749D',
    HBR: '0xd09270E917024E75086e27854740871F1C8E0E10',
    AST: '0x5ceCBde7811aC0Ed86Be11827AE622b89Bc429DF',
    KOS: '0xC15891E4dE2793726c20F53EcA6FB6319968E5F3',
    SWINE: '0xC410F3EB0c0f0E1EFA188D38C366536d59a265ba',
    X3NA: '0x5ECAddC28FcFc0bEDF94858c6D771420672ad2CF',
    AMB: ethers.constants.AddressZero
  }
};
