import { useCallback, useEffect, useState } from 'react';
import { fetchActiveMarkets } from '@features/kosmos/api';
import { MarketType } from '@features/kosmos/types';
import { useMarketsTokens } from './use-market-tokens';

export function useActiveMarkets() {
  const { tokens, isTokensLoading } = useMarketsTokens();

  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState<MarketType[]>([]);

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    fetchActiveMarkets(controller)
      .then((response) => setMarkets(response.data))
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  const refetchMarkets = useCallback(() => {
    setLoading(true);

    fetchActiveMarkets()
      .then((response) => setMarkets(response.data))
      .finally(() => setLoading(false));
  }, []);

  return {
    isMarketsLoading: loading || isTokensLoading,
    refetchMarkets,
    markets,
    tokens
  };
}
