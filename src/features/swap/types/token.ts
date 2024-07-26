export interface SwapToken {
  readonly address: string;
  readonly name: string;
  readonly symbol: string;
}

export interface TokenList {
  readonly default: {
    production: SwapToken;
    testnet: SwapToken;
  };
  readonly tokens: {
    production: SwapToken[];
    testnet: SwapToken[];
  };
}
