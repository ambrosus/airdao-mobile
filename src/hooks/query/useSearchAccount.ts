import { useQuery } from '@tanstack/react-query';
import { API } from '@api/api';
import { QueryResponse } from '@appTypes/QueryResponse';
import { ExplorerAccount } from '@models/Explorer';
import { ExplorerAccountDTO } from '@models/index';

export function useSearchAccount(
  address: string,
  enabled: boolean
): QueryResponse<ExplorerAccount | undefined> {
  const { data, error, isInitialLoading } = useQuery<ExplorerAccountDTO>(
    ['search-account', address],
    () => API.explorerService.searchAddress(address),
    { enabled }
  );

  return {
    data: data ? new ExplorerAccount(data) : undefined,
    loading: isInitialLoading,
    error
  };
}
