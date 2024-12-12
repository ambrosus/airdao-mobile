import { CryptoCurrencyCode } from '@appTypes';
import { SwapStringUtils } from '@features/swap/utils';

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
