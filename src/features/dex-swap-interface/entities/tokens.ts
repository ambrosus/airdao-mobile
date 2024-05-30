import { TokenList } from '@features/dex-swap-interface/types';

export const DEFAULT_TOKEN_LIST: TokenList = {
  keywords: ['airdao', 'default'],
  logoURI: 'ipfs://QmNa8mQkrNKp1WEEeGjFezDmDeodkWRevGFN8JCV7b4Xir',
  name: 'AirDAO Finance Default List',
  tags: {},
  timestamp: '2022-11-16T00:41:20.415Z',
  tokens: [
    {
      address: '0xf4fb9bf10e489ea3edb03e094939341399587b0c',
      chainId: 22040,
      decimals: 18,
      logoURI: '',
      name: 'AMB',
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
      address: '0x765e3e03f8dfca312EfdAb378e386E1EA60ee93F',
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
  version: { major: 1, minor: 0, patch: 1 }
};
