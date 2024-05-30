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
  ],
  version: { major: 1, minor: 0, patch: 1 }
};
