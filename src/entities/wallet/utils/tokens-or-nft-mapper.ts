import { Token } from '@models';
import { CryptoCurrencyCode } from '@appTypes';

export const _tokensOrNftMapper = (_tokens: Token[]) => {
  const tokens = _tokens.filter(
    (token) => token.symbol !== CryptoCurrencyCode.NFT
  );

  const nfts = _tokens.filter(
    (token) => token.symbol === CryptoCurrencyCode.NFT
  );

  return { tokens, nfts };
};
