import { FiltersState, MarketType, StatusFilterValues } from '../types';

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

export function filter(
  filters: FiltersState,
  markets: MarketType[],
  closedMarkets: MarketType[]
): MarketType[] {
  const { status, payment } = filters;

  const filteredMarkets = filterByStatus(status, markets, closedMarkets);

  if (!payment) {
    return filteredMarkets;
  }

  return [...markets, ...closedMarkets];
}
