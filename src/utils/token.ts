import { CryptoCurrencyCode } from '@appTypes';
import Config from '@constants/config';

export interface TokenInfo {
  address?: string;
  name: string;
  symbol: CryptoCurrencyCode | string;
}

const truncatePoolTokenName = (token: string) => {
  return token.split(' ')[0];
};

const getTokenDetails = (address: string): Promise<TokenInfo> | TokenInfo => {
  const currentToken =
    Config.ALL_TOKENS.find((t: { address: string }) => t.address === address) ||
    null;
  if (!currentToken) {
    return {
      name: address,
      symbol: ''
    };
  }
  return currentToken;
};

export const TokenUtils = { getTokenDetails, truncatePoolTokenName };
