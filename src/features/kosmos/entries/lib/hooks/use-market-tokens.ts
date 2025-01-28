import { useCallback, useEffect } from 'react';
import { fetchMarketTokens } from '../../api';
import { useTokensStore } from '../../model';

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

  const refetchTokens = useCallback(() => {
    onToggleLoading(true);
    const controller = new AbortController();
    fetchMarketTokens(controller)
      .then((response) => onChangeTokens(response.data))
      .finally(() => onToggleLoading(false));
  }, [onChangeTokens, onToggleLoading]);

  return { isTokensLoading: loading, tokens, refetchTokens };
}
