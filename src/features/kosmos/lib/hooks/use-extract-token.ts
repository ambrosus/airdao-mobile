import { useMemo } from 'react';
import { useMarketsTokens } from './use-market-tokens';
import { getTokenByAddress } from '@features/kosmos/utils';

export function useExtractToken(address: string) {
  const { tokens, isTokensLoading } = useMarketsTokens();

  const token = useMemo(() => {
    return getTokenByAddress(address, tokens);
  }, [address, tokens]);

  return { token, isTokensLoading };
}
