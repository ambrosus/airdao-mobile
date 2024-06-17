import { MULTI_ROUTE_ADDRESSES } from '../entities';

export function isMultiRouteRequired(
  path: [string, string],
  isExactIn: boolean
) {
  const [addressFrom, addressTo] = path;

  const isMultiRoute =
    isExactIn &&
    addressFrom === MULTI_ROUTE_ADDRESSES.USDC &&
    addressTo === MULTI_ROUTE_ADDRESSES.BOND;

  return isMultiRoute;
}
