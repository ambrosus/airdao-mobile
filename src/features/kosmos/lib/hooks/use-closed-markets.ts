import { useEffect, useState } from 'react';
import { fetchClosedMarkets } from '@features/kosmos/api';
import { MarketType } from '@features/kosmos/types';

export function useClosedMarkets() {
  const [loading, setLoading] = useState(false);
  const [closedMarkets, setClosedMarkets] = useState<MarketType[]>([]);

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    fetchClosedMarkets(controller)
      .then((response) => setClosedMarkets(response.data))
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  return { isClosedMarketsLoading: loading, closedMarkets };
}
