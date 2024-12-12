import { useCallback, useMemo } from 'react';
import { $token } from '@entities/kosmos/utils';
import { useMarketTokens } from '@entities/kosmos/lib/hooks/use-market-tokens';

export function useToken(address?: string) {
  const { tokens } = useMarketTokens();

  const token = useMemo(() => {
    if (address) return $token(address, tokens);
  }, [address, tokens]);

  const extractTokenCb = useCallback(
    (address: string) => {
      if (address) return $token(address, tokens);
    },
    [tokens]
  );

  return { token, extractTokenCb, isTokensLoading: tokens };
}
