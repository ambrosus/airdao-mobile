import { useCallback, useMemo } from 'react';
import { getTokenByAddress } from '@features/kosmos/utils';
import { useMarketTokens } from './use-market-tokens';

export function useExtractToken(address?: string) {
  const { tokens } = useMarketTokens();

  const token = useMemo(() => {
    if (address) return getTokenByAddress(address, tokens);
  }, [address, tokens]);

  const extractTokenCb = useCallback(
    (address: string) => {
      if (address) return getTokenByAddress(address, tokens);
    },
    [tokens]
  );

  return { token, extractTokenCb, isTokensLoading: tokens };
}
