export interface Currency {
  id: string;
  symbol: string;
  name: string;
  bestUSDPrice: string;
  decimals: string;
}

export type AwaitCurrencyResponse = {
  tokens: Currency[];
};
