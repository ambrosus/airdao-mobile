import Config from '@constants/config';
import { supportedChains } from '../helpers';

jest.mock('ethers', () => ({
  ethers: {
    constants: {
      AddressZero: '0x0000000000000000000000000000000000000000'
    }
  }
}));

const airdaoRequiredNamespaces = {
  eip155: {
    chains: [`eip155:${Config.CHAIN_ID}`]
  }
} as any;

const ethereumRequiredNamespaces = {
  eip155: {
    chains: ['eip155:1']
  }
} as any;

describe('Supported Chains Utility', () => {
  it(`Return correct network for AirDAO | Chain - ${Config.CHAIN_ID}`, () => {
    expect(supportedChains(airdaoRequiredNamespaces, {})).toStrictEqual([
      Config.env === 'testnet'
        ? {
            id: 22040,
            network: 'homestead',
            name: 'AirDAO',
            nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
            rpcUrl: 'https://network.ambrosus-test.io',
            blockExplorer: 'https://explorer-v2-api.ambrosus-test.io/v2'
          }
        : {
            id: 16718,
            network: 'homestead',
            name: 'AirDAO',
            nativeCurrency: { name: 'AirDAO', symbol: 'AMB', decimals: 18 },
            rpcUrl: 'https://network.ambrosus.io',
            blockExplorer: 'https://explorer-v2-api.ambrosus.io/v2'
          }
    ]);
  });

  it('Return empty array with external networks', () => {
    expect(supportedChains(ethereumRequiredNamespaces, {})).toStrictEqual([]);
  });
});
