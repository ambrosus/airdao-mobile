import { useEffect } from 'react';
import { fetchMarketTokens } from '@entities/kosmos/api';
import { useTokensStore } from '@entities/kosmos/model';

export function useMarketTokens() {
  const { tokens, onChangeTokens, loading, onToggleLoading } = useTokensStore();

  useEffect(() => {
    if (tokens.length > 0) return;

    onToggleLoading(true);
    const controller = new AbortController();

    fetchMarketTokens(controller)
      .then((response) => onChangeTokens(response.data))
      .finally(() => onToggleLoading(false));

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  return { isTokensLoading: loading, tokens };
}
