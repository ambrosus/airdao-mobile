import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { RodeoToken } from '@entities/amb-rodeo-tokens/types';
import { ApolloEndpointsKeys } from '@lib';
import { AMBRODEO_TOKENS } from '../rodeo-tokens.graph';

type TokensQuery = {
  tokens: RodeoToken[];
};

export function useRodeoTokensListQuery() {
  const { data, loading } = useQuery<TokensQuery>(AMBRODEO_TOKENS, {
    pollInterval: 60000, // Poll every minute,
    context: { apiName: ApolloEndpointsKeys.AMBRODEO_TOKENS }
  });

  const tokens = useMemo(() => data?.tokens || [], [data]);

  return { tokens, loading };
}
