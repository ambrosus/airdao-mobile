import { environment } from '@utils/environment';
import { TOKEN_ADDRESSES } from '../entities';

export function isMultiRouteRequired(path: string[], isExactIn: boolean) {
  const multiRouteAddresses = TOKEN_ADDRESSES[environment];
  const [addressFrom, addressTo] = path;

  const isMultiRoute =
    isExactIn &&
    addressFrom === multiRouteAddresses.USDC &&
    addressTo === multiRouteAddresses.BOND;

  return isMultiRoute;
}

export const addresses = TOKEN_ADDRESSES[environment];

export const isMultiRouteWithUSDCFirst = new Set([
  [addresses.USDC, addresses.BOND].join()
]);

export const isMultiRouteWithBONDFirst = new Set([
  [addresses.BOND, addresses.USDC].join()
]);
