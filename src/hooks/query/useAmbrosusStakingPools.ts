import { API } from '@api/api';
import { StakingPool, StakingPoolDTO } from '@models';
import { useQuery } from '@tanstack/react-query';

export function useAmbrosusStakingPools() {
  const { data, isLoading, isRefetching, error, refetch } = useQuery<
    StakingPoolDTO[]
  >(['amb-staking-pools'], API.getAmbrosusStakingPools);
  return {
    data: data ? data?.map((dto) => new StakingPool(dto)) : [],
    loading: isLoading,
    refetching: isRefetching,
    error,
    refetch
  };
}
