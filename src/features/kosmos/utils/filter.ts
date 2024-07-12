import { getTokenByAddress } from './token-by-address';
import {
  FiltersState,
  MarketType,
  PaymetsTokens,
  StatusFilterValues,
  Token
} from '../types';

export const INITIAL_FILTERS: FiltersState = {
  status: 'all',
  payment: null
};

function filterByStatus(
  status: StatusFilterValues,
  markets: MarketType[],
  closedMarkets: MarketType[]
): MarketType[] {
  switch (status) {
    case 'active':
      return markets;
    case 'closed':
      return closedMarkets;
    case 'all':
    default:
      return [...markets, ...closedMarkets];
  }
}

function filterMarketsByToken(
  markets: MarketType[],
  token: PaymetsTokens,
  tokens: Token[]
): MarketType[] {
  return markets.filter((market) => {
    const payoutToken = getTokenByAddress(market.payoutToken, tokens);
    return payoutToken && payoutToken.symbol === token;
  });
}

function filterByPayment(
  token: PaymetsTokens,
  markets: MarketType[],
  tokens: Token[]
): MarketType[] {
  return filterMarketsByToken(markets, token, tokens);
}

export const filter = (
  filters: FiltersState,
  markets: MarketType[],
  closedMarkets: MarketType[],
  tokens: Token[]
): MarketType[] => {
  const { status, payment } = filters;
  const filteredMarkets = filterByStatus(status, markets, closedMarkets);

  if (payment) return filterByPayment(payment, filteredMarkets, tokens);

  return filteredMarkets;
};
