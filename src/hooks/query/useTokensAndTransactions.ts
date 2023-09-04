import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { Transaction, TokenDTO } from '@models';

export function useTokensAndTransactions(
  walletAddress: string | undefined
): QueryResponse<
  { tokens: TokenDTO[]; transactions: Transaction[] } | undefined
> {
  const { data, error, isInitialLoading } = useQuery<{
    tokens: TokenDTO[];
    transactions: Transaction[];
  }>(
    ['tokens-and-transactions', walletAddress],
    async () => {
      try {
        const { tokens, transactions } =
          await API.explorerService.searchWalletV2(walletAddress);
        return { tokens, transactions };
      } catch (error) {
        throw error;
      }
    },
    {
      enabled: !!walletAddress
    }
  );

  return {
    data,
    loading: isInitialLoading,
    error
  };
}
