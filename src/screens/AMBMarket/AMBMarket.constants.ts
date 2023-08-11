import { t } from 'i18next';

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
    title: t('market.cap'),
    body: t('market.cap.popup'),
    testID: 'market-cap-popupinfo',
    idx: 2,
    key: 'marketCap'
  },
  fullyDilutedMarketCap: {
    title: t('fully.diluted.market.cap'),
    body: t('fully.diluted.market.cap.popup'),
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
    title: t('circulating.supply'),
    body: t('circulating.supply.popup'),
    testID: 'circulation-popupinfo',
    idx: 4,
    key: 'circulatingSupply'
  },
  maxSupply: {
    title: t('max.supply'),
    body: t('max.supply.popup'),
    testID: 'max-supply-popupinfo',
    idx: 0,
    key: 'maxSupply'
  },
  totalSupply: {
    title: t('total.supply'),
    body: t('total.supply.popup'),
    testID: 'total-supply-popupinfo',
    idx: 1,
    key: 'totalSupply'
  }
} as const;
