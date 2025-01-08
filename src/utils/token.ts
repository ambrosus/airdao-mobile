import { CryptoCurrencyCode } from '@appTypes';
import Config from '@constants/config';
import { SwapStringUtils } from '@features/swap/utils';

export interface TokenInfo {
  address?: string;
  name: string;
  symbol: CryptoCurrencyCode | string;
}

interface TokenExtendProps {
  tokenNameFromDatabase: string | 'unknown';
  symbol: string;
}

export function wrapTokenIcon<T extends TokenExtendProps>(token: T) {
  if (token.symbol === CryptoCurrencyCode.AMB) {
    return 'AirDAO';
  }

  const { tokenNameFromDatabase } = token;

  const isTokenNameFromDBExist =
    tokenNameFromDatabase && tokenNameFromDatabase !== 'unknown';

  return SwapStringUtils.extendedLogoVariants(
    token[isTokenNameFromDBExist ? 'tokenNameFromDatabase' : 'symbol'] ?? ''
  );
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
