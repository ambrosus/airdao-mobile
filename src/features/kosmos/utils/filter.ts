import i18n from '@localization/i18n';
import { getTokenByAddress } from './token-by-address';
import {
  FiltersState,
  MarketType,
  PaymetsTokens,
  StatusFilterValues,
  Token
} from '../types';

export const INITIAL_FILTERS: FiltersState = {
  status: i18n.t('kosmos.status.all'),
  payment: null
};

function filterByStatus(
  status: StatusFilterValues,
  markets: MarketType[],
  closedMarkets: MarketType[]
): MarketType[] {
  switch (status) {
    case i18n.t('kosmos.status.active'):
      return markets;
    case i18n.t('kosmos.status.closed'):
      return closedMarkets;
    case i18n.t('kosmos.status.all'):
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
    const qouteToken = getTokenByAddress(market.quoteToken, tokens);
    return qouteToken && qouteToken.symbol === token;
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
