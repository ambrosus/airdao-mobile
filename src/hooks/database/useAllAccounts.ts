import { useQuery } from '@tanstack/react-query';
import { DatabaseTable, QueryResponse } from '@appTypes';
import { AccountDBModel, Database } from '@database';

export const useAllAccounts = (): QueryResponse<AccountDBModel[]> => {
  const { data, error, isLoading, isRefetching, isInitialLoading, refetch } =
    useQuery<AccountDBModel[], Error>(
      ['get-all-accounts'],
      async () =>
        (await Database.query(DatabaseTable.Accounts)) as AccountDBModel[]
    );

  return {
    data: data || [],
    loading: isInitialLoading || isLoading || isRefetching,
    error,
    refetch
  };
};
