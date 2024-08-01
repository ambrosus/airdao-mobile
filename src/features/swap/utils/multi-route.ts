import { environment } from '@utils/environment';
import { SWAP_SUPPORTED_TOKENS, TOKEN_ADDRESSES } from '../entities';

export const addresses = TOKEN_ADDRESSES[environment];

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
// export const extractArrayOfMiddleMultiHopAddresses = (path: string[]) => {
//   const tokens = SWAP_SUPPORTED_TOKENS.tokens[environment];

//   const filterByAddress = tokens.filter((token) => {
//     return !path.includes(token.address);
//   });

//   if (path.includes(addresses.AMB)) {
//     return filterByAddress.filter((token) => token.symbol !== 'SAMB');
//   } else if (path.includes(addresses.SAMB)) {
//     return filterByAddress.filter((token) => token.symbol !== 'AMB');
//   }

//   return filterByAddress;
// };

export const extractArrayOfMiddleMultiHopAddresses = (path: string[]) => {
  const tokens = SWAP_SUPPORTED_TOKENS.tokens[environment];

  const filterByAddress = tokens.filter((token) => {
    return !path.includes(token.address);
  });

  if (path.includes(addresses.AMB)) {
    return filterByAddress.filter((token) => token.symbol !== 'SAMB')[0];
  } else if (path.includes(addresses.SAMB)) {
    return filterByAddress.filter((token) => token.symbol !== 'AMB')[0];
  }

  return filterByAddress[0];
};
