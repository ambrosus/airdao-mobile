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
    title: 'amb.market.market.cap',
    body: 'amb.market.market.cap.popup',
    testID: 'market-cap-popupinfo',
    idx: 2,
    key: 'marketCap'
  },
  fullyDilutedMarketCap: {
    title: 'amb.market.fully.diluted.market.cap',
    body: 'amb.market.fully.diluted.market.cap.popup',
    testID: 'diluted-cap-popupinfo',
    idx: 3,
    key: 'fullyDilutedMarketCap'
  },
  // volume24H: {
  //   title: '24hr volume',
  //   body: 'A measure of how much of a cryptocurrency was traded in the last 24 hours.',
  //   testID: '24-hour-volume-popupinfo',
  //   idx: 5,
  //   key: 'volume24H'
  // },
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
    title: 'amb.market.circulating.supply',
    body: 'amb.market.circulating.supply.popup',
    testID: 'circulation-popupinfo',
    idx: 4,
    key: 'circulatingSupply'
  },
  maxSupply: {
    title: 'amb.market.max.supply',
    body: 'amb.market.max.supply.popup',
    testID: 'max-supply-popupinfo',
    idx: 0,
    key: 'maxSupply'
  },
  totalSupply: {
    title: 'amb.market.total.supply',
    body: 'amb.market.total.supply.popup',
    testID: 'total-supply-popupinfo',
    idx: 1,
    key: 'totalSupply'
  }
} as const;
