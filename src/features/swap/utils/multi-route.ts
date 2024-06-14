import { MULTI_ROUTE_ADDRESSES } from '../entities';

export function isMultiRouteRequired(
  path: [string, string],
  isExactIn: boolean
) {
  const [addressFrom, addressTo] = path;

  const original =
    isExactIn &&
    addressFrom === MULTI_ROUTE_ADDRESSES.USDC &&
    addressTo === MULTI_ROUTE_ADDRESSES.BOND;

  const reversed =
    isExactIn &&
    addressFrom === MULTI_ROUTE_ADDRESSES.BOND &&
    addressTo === MULTI_ROUTE_ADDRESSES.USDC;

  return { original, reversed };
}
