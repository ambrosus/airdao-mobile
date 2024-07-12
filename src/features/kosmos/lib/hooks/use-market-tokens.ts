import { useEffect, useState } from 'react';
import { fetchMarketTokens } from '@features/kosmos/api';
import { Token } from '@features/kosmos/types';

export function useMarketsTokens() {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    fetchMarketTokens(controller)
      .then((response) => setTokens(response.data))
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  return { isTokensLoading: loading, tokens };
}
