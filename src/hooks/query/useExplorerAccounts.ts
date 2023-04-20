import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { getExplorerAccounts } from '@api/api';
import { ExplorerAccountDTO } from '@models/index';
import { ExplorerAccount } from '@models/Explorer';
import { ExplorerSort } from '@screens/Explore/Explore.types';

export function useExplorerAccounts(
  sort: ExplorerSort
): QueryResponse<ExplorerAccount[] | undefined> {
  const { data, isLoading, error } = useQuery<ExplorerAccountDTO[]>(
    ['explorer-accounts', sort],
    () => getExplorerAccounts(20, sort)
  );

  return {
    data: data
      ? data.map((dto: ExplorerAccountDTO) => new ExplorerAccount(dto))
      : undefined,
    loading: isLoading,
    error
  };
}
