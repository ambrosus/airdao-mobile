import { environment } from '@utils/environment';
import { TOKEN_ADDRESSES } from '../entities';

export const addresses = TOKEN_ADDRESSES[environment];

export const isMultiRouteWithUSDCFirst = new Set([
  [addresses.USDC, addresses.BOND].join()
]);

export const isMultiRouteWithBONDFirst = new Set([
  [addresses.BOND, addresses.USDC].join()
]);

export const isMultiRouteWithAMBFirst = new Set([
  [addresses.AMB, addresses.BOND].join()
]);

export const isMultiRouteWithSAMBFirst = new Set([
  [addresses.SAMB, addresses.BOND].join()
]);

export const isMultiHopSwapAvaliable = (path: string[]): boolean => {
  const [addressFrom, addressTo] = path;

  const isMultiRouteWithBOND = isMultiRouteWithBONDFirst.has(
    [addressFrom, addressTo].join()
  );

  const isMultiRouteWithAMB = isMultiRouteWithAMBFirst.has(
    [addressFrom, addressTo].join()
  );

  const isMultiRouteWithSAMB = isMultiRouteWithSAMBFirst.has(
    [addressFrom, addressTo].join()
  );

  return isMultiRouteWithBOND || isMultiRouteWithAMB || isMultiRouteWithSAMB;
};

export const extractMiddleAddressMultiHop = (path: string[]): string => {
  const [addressFrom] = path;

  if (addressFrom === addresses.AMB || addressFrom === addresses.SAMB)
    return addresses.USDC;

  if (addressFrom === addresses.BOND) return addresses.AMB;

  return '';
};
