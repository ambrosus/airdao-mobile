import { useQuery } from '@tanstack/react-query';
import { API } from '@api/api';
import { QueryResponse } from '@appTypes/QueryResponse';
import { ExplorerInfo } from '@models/Explorer';
import { ExplorerInfoDTO } from '@models/index';

export function useExplorerInfo(): QueryResponse<ExplorerInfo | undefined> {
  const { data, isLoading, error, refetch } = useQuery<ExplorerInfoDTO>(
    ['explorer-info'],
    API.explorerService.getExplorerInfo
  );

  return {
    data: data ? new ExplorerInfo(data) : undefined,
    loading: isLoading,
    refetch,
    error
  };
}
