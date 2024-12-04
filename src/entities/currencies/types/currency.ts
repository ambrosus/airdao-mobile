export interface Currency {
  id: string;
  symbol: string;
  lastBestPrice: string;
}

export type AwaitCurrencyResponse = {
  tokens: Currency[];
};
