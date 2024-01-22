import { useQuery } from '@tanstack/react-query';
import { DatabaseTable, QueryResponse } from '@appTypes';
import { Database, PublicAddressListDbModel } from '@database';

export const useAllGroups = (): QueryResponse<PublicAddressListDbModel[]> => {
  const { data, error, isLoading, isRefetching, isInitialLoading, refetch } =
    useQuery<PublicAddressListDbModel[], Error>(
      ['all-groups'],
      async () =>
        (await Database.query(
          DatabaseTable.PublicAddressLists
        )) as PublicAddressListDbModel[]
    );

  return {
    data: data || [],
    loading: isInitialLoading || isLoading || isRefetching,
    error,
    refetch
  };
};
