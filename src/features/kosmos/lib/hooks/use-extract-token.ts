import { useCallback, useMemo } from 'react';
import { useMarketsTokens } from './use-market-tokens';
import { getTokenByAddress } from '@features/kosmos/utils';

export function useExtractToken(address?: string) {
  const { tokens, isTokensLoading } = useMarketsTokens();

  const token = useMemo(() => {
    if (address) return getTokenByAddress(address, tokens);
  }, [address, tokens]);

  const extractTokenCb = useCallback(
    (address: string) => {
      if (address) return getTokenByAddress(address, tokens);
    },
    [tokens]
  );

  return { token, extractTokenCb, isTokensLoading };
}
