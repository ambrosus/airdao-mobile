import { useEffect } from 'react';
import { fetchMarketTokens } from '@features/kosmos/api';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context/markets/markets.context';

export function useMarketTokens() {
  const { tokens, isTokensLoading, setTokens, setIsTokensLoading } =
    useKosmosMarketsContextSelector();

  useEffect(() => {
    if (tokens.length > 0) return;

    setIsTokensLoading(true);
    const controller = new AbortController();

    fetchMarketTokens(controller)
      .then((response) => setTokens(response.data))
      .finally(() => setIsTokensLoading(false));

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  return { isTokensLoading, tokens };
}
