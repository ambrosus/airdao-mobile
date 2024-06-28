import { environment } from '@utils/environment';
import { MULTI_ROUTE_ADDRESSES } from '../entities';

export function isMultiRouteRequired(path: string[], isExactIn: boolean) {
  const multiRouteAddresses = MULTI_ROUTE_ADDRESSES[environment];
  const [addressFrom, addressTo] = path;

  const isMultiRoute =
    isExactIn &&
    addressFrom === multiRouteAddresses.USDC &&
    addressTo === multiRouteAddresses.BOND;

  return isMultiRoute;
}

export const multiRouteAddresses = MULTI_ROUTE_ADDRESSES[environment];

export const isMultiRouteWithUSDCFirst = new Set([
  [multiRouteAddresses.USDC, multiRouteAddresses.BOND].join()
]);

export const isMultiRouteWithBONDFirst = new Set([
  [multiRouteAddresses.BOND, multiRouteAddresses.USDC].join()
]);
