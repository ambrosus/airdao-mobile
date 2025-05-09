import { useQuery } from '@apollo/client';
import { ethereumAddressRegex } from '@constants/regex';
import { RodeoToken } from '@entities/amb-rodeo-tokens/types';
import { ApolloEndpointsKeys } from '@lib';
import { AMBRODEO_TOKEN } from '../rodeo-tokens.graph';

export function useRodeoSingleTokenQuery(id: string | undefined) {
  const { data, loading } = useQuery<{ token: RodeoToken }>(AMBRODEO_TOKEN, {
    context: { apiName: ApolloEndpointsKeys.AMBRODEO_TOKENS },
    variables: { id: id?.toLowerCase() },
    skip: !id || ethereumAddressRegex.test(id) === false
  });

  return { data, loading };
}
