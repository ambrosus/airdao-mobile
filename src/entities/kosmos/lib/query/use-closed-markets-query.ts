import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchClosedMarkets } from '@entities/kosmos/api';
import { MarketType, FiltersState } from '@entities/kosmos/types';

export function useClosedMarketsQuery(filters: FiltersState) {
  const { t } = useTranslation();
  const isActive = filters.status === t('kosmos.status.active');

  const { data, isFetching, isRefetching, status, refetch } = useQuery<
    MarketType[]
  >(['closed-markets'], fetchClosedMarkets, {
    enabled: !isActive,
    refetchOnWindowFocus: false,
    retry: false
  });

  const isLoading = useMemo(() => {
    if (isActive) return false;
    return isFetching || isRefetching || status === 'loading';
  }, [isActive, isFetching, isRefetching, status]);

  return {
    closedMarkets: data,
    isLoading,
    refetchClosedMarkets: refetch
  };
}
