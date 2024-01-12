import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import web3ContractHelper from '@lib/helpers/AirDAOWeb3ContractHelper';

export function useAirbondPrice(): QueryResponse<any> {
  const { data, isLoading, isRefetching, error, refetch } = useQuery<any>(
    ['airbond-token'],
    async () => {
      const airbondPriceWei = await web3ContractHelper.getAirBondPrice();
      return airbondPriceWei;
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
