import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { Transaction } from '@models';

export function useTransactionsOfToken(
  address: string,
  tokenAddress: string
): QueryResponse<Transaction[]> {
  const { data, error, isInitialLoading } = useQuery<Transaction[]>(
    ['transactions-of-token', tokenAddress],
    async () => {
      try {
        const response = await API.explorerService.getTokenTransactionsV2(
          address,
          tokenAddress
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    }
  );

  return {
    data: data || [],
    loading: isInitialLoading,
    error
  };
}
