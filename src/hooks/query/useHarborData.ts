import { BigNumber } from 'ethers';
import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { harborService } from '@api/harbor/harbor-service';
import { useWalletStore } from '@entities/wallet';

interface HarborInfoModel {
  harborAPR: string;
  totalStaked: BigNumber;
  currentUserStaked: BigNumber;
}

export function useHarborData(): QueryResponse<HarborInfoModel> {
  const { wallet } = useWalletStore();
  const { data, isLoading, isRefetching, error, refetch } = useQuery<any>(
    ['harbor-data'],
    async () => {
      const harborAPR = await harborService.getStakeAPR();
      const totalStaked = await harborService.getTotalStaked();
      const currentUserStaked = await harborService.getCurrentUserStaked(
        wallet?.address || ''
      );
      return {
        harborAPR,
        totalStaked,
        currentUserStaked
      };
    }
  );

  return {
    data,
    loading: isLoading,
    refetching: isRefetching,
    error,
    refetch
  };
}
