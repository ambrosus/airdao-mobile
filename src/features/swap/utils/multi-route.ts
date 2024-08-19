import { environment } from '@utils/environment';
import { SWAP_SUPPORTED_TOKENS, TOKEN_ADDRESSES } from '../entities';

export const addresses = TOKEN_ADDRESSES[environment];

export const isMultiHopSwapAvaliable = (path: string[]): boolean => {
  return !!extractArrayOfMiddleMultiHopAddresses(path).address;
};

export const extractMiddleAddressMultiHop = (path: string[]): string => {
  const [addressFrom] = path;

  if (addressFrom === addresses.AMB || addressFrom === addresses.SAMB)
    return addresses.USDC;

  if (addressFrom === addresses.BOND) return addresses.AMB;

  return '';
};

export const extractArrayOfMiddleMultiHopAddresses = (path: string[]) => {
  const tokens = SWAP_SUPPORTED_TOKENS.tokens[environment];

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
