import { useQuery } from '@tanstack/react-query';
import { DatabaseTable, QueryResponse } from '@appTypes';
import { Database, WalletDBModel } from '@database';

export const useAllWallets = (): QueryResponse<WalletDBModel[]> => {
  const { data, error, isInitialLoading } = useQuery<WalletDBModel[], Error>(
    ['get-all-wallets'],
    async () => (await Database.query(DatabaseTable.Wallets)) as WalletDBModel[]
  );

  return {
    data: data || [],
    loading: isInitialLoading,
    error
  };
};
