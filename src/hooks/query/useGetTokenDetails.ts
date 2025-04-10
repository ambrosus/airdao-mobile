import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { explorerService } from '@api/explorer-service';
import { QueryResponse } from '@appTypes';
import { TokenInfo } from '@utils';

export function useGetTokenDetails(
  address: string | undefined
): Pick<QueryResponse<TokenInfo>, 'data' | 'loading' | 'error'> {
  const { data, isLoading, error } = useQuery(
    ['token-details', address],
    () => explorerService.getTokenDetails(address as string),
    { enabled: !!address }
  );

  const token = useMemo(() => {
    return (Array.isArray(data) ? data[0] : data) ?? {};
  }, [data]);

  return { data: token as unknown as TokenInfo, loading: isLoading, error };
}
