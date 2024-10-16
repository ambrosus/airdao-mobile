import { supportedChains } from '../helpers';

const airdaoRequiredNamespaces = {
  eip155: {
    chains: ['eip155:16718']
  }
} as any;

const ethereumRequiredNamespaces = {
  eip155: {
    chains: ['eip155:1']
  }
} as any;

describe('Supported Chains Utility', () => {
  it('Return correct network for AirDAO Mainnet', () => {
    expect(supportedChains(airdaoRequiredNamespaces, {})).toStrictEqual([
      {
        id: 16718,
        network: 'homestead',
        name: 'AirDAO',
        nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
        rpcUrl: 'https://network.ambrosus.io',
        blockExplorer: 'https://explorer-api.ambrosus.io'
      }
    ]);
  });

  it('Return empty array with external networks', () => {
    expect(supportedChains(ethereumRequiredNamespaces, {})).toStrictEqual([]);
  });
});
