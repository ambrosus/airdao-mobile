import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchActiveMarkets } from '@entities/kosmos/api';
import { MarketType, FiltersState } from '@entities/kosmos/types';

export function useActiveMarketsQuery(filters: FiltersState) {
  const { t } = useTranslation();
  const isClosed = filters.status === t('kosmos.status.closed');

  const { data, isFetching, isRefetching, status, refetch } = useQuery<
    MarketType[]
  >(['active-markets'], fetchActiveMarkets, {
    enabled: !isClosed
  });

  const isLoading = useMemo(() => {
    if (isClosed) return false;
    return isFetching || isRefetching || status === 'loading';
  }, [isFetching, isClosed, isRefetching, status]);

  return {
    markets: data,
    isLoading,
    refetchActiveMarkets: refetch
  };
}
