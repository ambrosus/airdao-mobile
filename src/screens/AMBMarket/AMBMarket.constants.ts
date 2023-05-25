export type InfoKey =
  | 'maxSupply'
  | 'totalSupply'
  | 'marketCap'
  | 'fullyDilutedMarketCap'
  | 'circulatingSupply'
  | 'volume24H';

export interface AMBMarketItem {
  title: string;
  body: string;
  testID: string;
  idx: number;
  key: InfoKey;
}
export const AMBMarketItemsInfo: { [key: string]: AMBMarketItem } = {
  marketCap: {
    title: 'Market Cap',
    body: "A measure of the total value of a cryptocurrency's circulating supply, calculated by multiplying the current price by the number of coins in circulation.",
    testID: 'market-cap-popupinfo',
    idx: 2,
    key: 'marketCap'
  },
  fullyDilutedMarketCap: {
    title: 'Fully Diluted Market Cap',
    body: "A measure of the total value of a cryptocurrency's circulating supply, calculated by multiplying the current price by the number of coins in circulation.",
    testID: 'diluted-cap-popupinfo',
    idx: 3,
    key: 'fullyDilutedMarketCap'
  },
  volume24H: {
    title: '24hr Volume',
    body: 'A measure of how much of a cryptocurrency was traded in the last 24 hours.',
    testID: '24-hour-volume-popupinfo',
    idx: 5,
    key: 'volume24H'
  },
  // cexVol: {
  //   title: 'CEX Vol',
  //   body: 'A measure of how much of a cryptocurrency was traded in the last 24 hours on a centralized exchange (CEX).',
  //   testID: 'cex-volume-popupinfo'
  // },
  // dexVol: {
  //   title: 'DEX Vol',
  //   body: 'A measure of how much of a cryptocurrency was traded in the last 24 hours on a decentralized exchange (DEX).',
  //   testID: 'dex-volume-popupinfo'
  // },
  circulatingSupply: {
    title: 'Circulating Supply',
    body: 'The amount of coins that are circulating in the market and are in public hands. It is analogous to the flowing shares in the stock market.',
    testID: 'circulation-popupinfo',
    idx: 4,
    key: 'circulatingSupply'
  },
  maxSupply: {
    title: 'Max Supply',
    body: 'The maximum amount of coins that will ever exist in the lifetime of the cryptocurrency, indicating the limit of its potential supply.',
    testID: 'max-supply-popupinfo',
    idx: 0,
    key: 'maxSupply'
  },
  totalSupply: {
    title: 'Total Supply',
    body: 'The amount of coins that have been already created, minus any coins that have been burned, providing a measure of the current supply of a cryptocurrency.',
    testID: 'total-supply-popupinfo',
    idx: 1,
    key: 'totalSupply'
  }
} as const;
