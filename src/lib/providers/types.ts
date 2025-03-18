export type TMainnet = {
  readonly id: 16718;
  readonly name: 'AirDAO Mainnet';
  readonly nativeCurrency: {
    readonly name: 'Amber';
    readonly symbol: 'AMB';
    readonly decimals: 18;
  };
  readonly rpcUrls: {
    readonly default: {
      readonly http: readonly [
        'https://rpc.airdao.io',
        'https://network.ambrosus.io'
      ];
    };
  };
  readonly blockExplorers: {
    readonly default: {
      readonly name: 'AirDAO Explorer';
      readonly url: 'https://airdao.io/explorer/';
    };
  };
  readonly contracts: {
    readonly multicall3: {
      readonly address: '0x021de22a8b1B021f07a94B047AA557079BbCa6ed';
    };
  };
};

export type TTestnet = {
  id: 22040;
  name: 'AirDAO Testnet';
  nativeCurrency: {
    name: 'Amber';
    symbol: 'AMB';
    decimals: 18;
  };
  rpcUrls: {
    default: {
      http: readonly [
        'https://testnet-rpc.airdao.io',
        'https://network.ambrosus-test.io'
      ];
    };
  };
  blockExplorers: {
    default: {
      name: 'AirDAO Explorer';
      url: 'https://testnet.airdao.io/explorer/';
    };
  };
  contracts: {
    multicall3: {
      address: '0xf4FBBC66fD2B6323B7360072CDF32C0F816c9836';
    };
  };
  testnet: true;
};
