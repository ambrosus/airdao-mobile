import { API } from '@api/api';
import { CryptoCurrencyCode } from '@appTypes';
import { ALL_TOKENS } from '@constants/allToken';

export interface TokenInfo {
  address?: string;
  name: string;
  symbol: CryptoCurrencyCode | string;
}

const getTokenDetails = (address: string): Promise<TokenInfo> | TokenInfo => {
  const currentToken = ALL_TOKENS.find((t) => t.address === address) || null;
  if (currentToken) {
    return currentToken;
  } else {
    return API.explorerService.getAllTokens().then((tokens) => {
      const currentToken = tokens.find((t) => t.address === address);
      return {
        name: currentToken?.name || '',
        symbol: currentToken?.symbol || ''
      };
    });
  }
};

export const TokenUtils = { getTokenDetails };
