import { environment } from '@utils/environment';
import {
  SWAP_SUPPORTED_TOKENS,
  TOKEN_ADDRESSES
} from '@features/swap/entities';
import { wrapNativeAddress } from '@features/swap/utils';

export const addresses = TOKEN_ADDRESSES[environment];

export const isMultiHopSwapAvailable = (path: string[]): boolean => {
  return !!extractArrayOfMiddleMultiHopAddresses(path).address;
};

export const withMultiHopPath = (path: string[]) => {
  const middleHopAddress = extractArrayOfMiddleMultiHopAddresses(path).address;

  const _innerPath = [path[0], middleHopAddress, path[1]];
  return wrapNativeAddress(_innerPath);
};

export const extractArrayOfMiddleMultiHopAddresses = (path: string[]) => {
  const tokens = SWAP_SUPPORTED_TOKENS.tokens[environment].filter(
    (token) => token.symbol !== 'SAMB'
  );

  const filterByAddress = tokens.filter((token) => {
    return !path.includes(token.address);
  });

  if (path.includes(addresses.AMB)) {
    return filterByAddress.filter(
      (token) => token.address !== addresses.SAMB
    )[0];
  } else if (path.includes(addresses.SAMB)) {
    return filterByAddress.filter(
      (token) => token.address !== addresses.AMB
    )[0];
  }

  return filterByAddress[0];
};
