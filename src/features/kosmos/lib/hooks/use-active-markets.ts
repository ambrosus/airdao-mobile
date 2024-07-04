import { fetchActiveMarkets } from '@features/kosmos/api';
import { MarketType } from '@features/kosmos/types';
import { useEffect, useState } from 'react';

export function useActiveMarkets() {
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

  return { isMarketsLoading: loading, markets };
}
