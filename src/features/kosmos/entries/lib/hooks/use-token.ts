import { useCallback, useMemo } from 'react';
import { $token } from './token';
import { useMarketTokens } from './use-market-tokens';

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
