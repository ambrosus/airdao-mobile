import { API } from '@api/api';
import { StakingPool, StakingPoolDTO } from '@models';
import { useQuery } from '@tanstack/react-query';
import { TokenUtils } from '@utils/token';

export function useAmbrosusStakingPools() {
  const { data, isLoading, isRefetching, error, refetch } = useQuery<
    StakingPoolDTO[]
  >(['amb-staking-pools'], API.getAmbrosusStakingPools);
  return {
    data: data ? data?.map((dto) => new StakingPool(dto, TokenUtils)) : [],
    loading: isLoading,
    refetching: isRefetching,
    error,
    refetch
  };
}
