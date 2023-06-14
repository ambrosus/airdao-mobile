import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { ExplorerInfoDTO } from '@models/index';
import { ExplorerInfo } from '@models/Explorer';

export function useExplorerInfo(): QueryResponse<ExplorerInfo | undefined> {
  const { data, isLoading, error } = useQuery<ExplorerInfoDTO>(
    ['explorer-info'],
    API.explorerService.getExplorerInfo
  );

  return {
    data: data ? new ExplorerInfo(data) : undefined,
    loading: isLoading,
    error
  };
}
