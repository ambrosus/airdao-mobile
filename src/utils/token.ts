import { API } from '@api/api';
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

const getTokenDetails = async (
  address: string
): Promise<Promise<TokenInfo> | TokenInfo> => {
  const currentToken =
    Config.ALL_TOKENS.find((t) => t.address === address) || null;
  if (currentToken) {
    return currentToken;
  } else {
    return await API.explorerService.getAllTokens().then((tokens) => {
      const _currentToken = tokens.find((t) => t.address === address);
      return {
        name: _currentToken?.name || '',
        symbol: _currentToken?.symbol || ''
      };
    });
  }
};

export const TokenUtils = { getTokenDetails, truncatePoolTokenName };
