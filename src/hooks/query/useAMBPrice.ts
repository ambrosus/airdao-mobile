import { useQuery } from '@tanstack/react-query';
import { QueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { AMBToken, AMBTokenDTO } from '@models/index';

export function useAMBPrice(): QueryResponse<AMBToken | undefined> {
  const { data, isLoading, error } = useQuery<AMBTokenDTO>(
    ['amb-token'],
    API.getAMBTokenData
  );

  return {
    data: data ? new AMBToken(data) : undefined,
    loading: isLoading,
    error
  };
}
