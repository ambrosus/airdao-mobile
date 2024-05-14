import { QueryResponse } from '@appTypes/QueryResponse';
import { nftContractService } from '@api/nft-contract-service';
import { useQuery } from '@tanstack/react-query';

interface NftTokenModel {
  tokenId: string;
  tokenUri: string;
}
export function useNFTInfo(
  walletAccount: string
): QueryResponse<NftTokenModel | undefined> {
  const { data, isLoading, error, isRefetching } = useQuery<NftTokenModel>(
    ['amb-nft'],
    () => nftContractService.getNftParams(walletAccount),
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
