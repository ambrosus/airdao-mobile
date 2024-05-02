import { useQuery } from '@tanstack/react-query';
import { API } from '@api/api';
import { Bridge } from '@models/Bridge';
import { QueryResponse } from '@appTypes';

// interface NftTokenModel {
//     tokenId: string;
//     tokenUri: string;
// }
export function useBridgeService(): QueryResponse<
  { data: Bridge } | undefined
> {
  const { data, isLoading, error, isRefetching } = useQuery<Bridge>(
    ['amb-nft'],
    async () => await API.bridgeService.getBridgeParams(),
    {
      keepPreviousData: true
    }
  );
  return {
    loading: isLoading || isRefetching,
    error,
    data
  };
}
