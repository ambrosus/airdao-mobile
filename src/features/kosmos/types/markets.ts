export type LoadingMarketsState = {
  markets?: boolean;
  closedMarkets?: boolean;
  tokens?: boolean;
};

export type MarketType = {
  callbackAddr: string;
  capacity: string;
  capacityInQuote: boolean;
  conclusion: number;
  createdAt: string;
  id: string;
  isLive: boolean;
  marketType: string;
  maxPayout: string;
  owner: string;
  payoutToken: string;
  price: string;
  quoteToken: string;
  scale: string;
  start: number;
  updatedAt: string;
  vesting: number;
  vestingType: string;
  bondMarketPrice: number;
  discount: number;
  __v: number;
  sold: string;
  askingPrice: number;
  actualMarketPrice: number;
};

export type TxType = {
  addressFrom: string;
  bondAmount: string;
  createdAt: string;
  date: number;
  discount: number;
  isClaimed: boolean;
  marketId: number;
  payoutAmount: string;
  payoutToken: string;
  quoteToken: string;
  txHash: string;
  updatedAt: string;
  eventId: string;
  vesting: number;
  vestingType: string;
  version: string;
};

export type Token = {
  contractAddress: string;
  decimals: number;
  id: string;
  logoUrl: string;
  name: string;
  price: number;
  symbol: string;
  tokenId: string;
  displayPrecision: number;
};
