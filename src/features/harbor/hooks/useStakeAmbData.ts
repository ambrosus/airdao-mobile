import { useHarborData } from '@hooks/query/useHarborData';
import { useAMBPrice } from '@hooks';
import { formatEther } from 'ethers/lib/utils';
import { useMemo } from 'react';

export const useStakeAmbData = () => {
  const {
    data: harborData,
    refetch: harborRefetch,
    loading: harborLoading,
    refetching: harborRefetching
  } = useHarborData();

  const {
    data: priceData,
    refetch: priceRefetch,
    loading: priceLoading,
    refetching: priceRefetching
  } = useAMBPrice();

  const refetchAll = () => {
    if (harborRefetch) {
      harborRefetch();
    }
    if (priceRefetch) {
      priceRefetch();
    }
  };

  const totalStaked = useMemo(() => {
    const isAllData = harborData?.totalStaked && priceData?.priceUSD;

    const totalStakeAMB = formatEther(harborData?.totalStaked || 0);
    const totalStakedUSD =
      isAllData &&
      +formatEther(harborData?.totalStaked) * (priceData?.priceUSD || 0);
    return {
      crypto: totalStakeAMB,
      usd: totalStakedUSD || '0'
    };
  }, [harborData?.totalStaked, priceData?.priceUSD]);

  return {
    currentUserStakedAmount: formatEther(harborData?.currentUserStaked || 0),
    harborAPR: harborData?.harborAPR || '',
    totalStakedOnHarbor: totalStaked,
    refetch: refetchAll,
    loading:
      harborLoading || harborRefetching || priceLoading || priceRefetching
  };
};
