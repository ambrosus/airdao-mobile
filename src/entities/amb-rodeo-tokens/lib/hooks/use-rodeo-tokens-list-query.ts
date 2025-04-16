import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useRodeoTokensStore } from '@entities/amb-rodeo-tokens/model';
import { RodeoToken } from '@entities/amb-rodeo-tokens/types';
import { ApolloEndpointsKeys } from '@lib';
import { AMBRODEO_TOKENS } from '../rodeo-tokens.graph';

type TokensQuery = {
  tokens: RodeoToken[];
};

export function useRodeoTokensListQuery() {
  const { tokens: allRodeoTokens, onChangeRodeoTokens } = useRodeoTokensStore();

  const { data, loading } = useQuery<TokensQuery>(AMBRODEO_TOKENS, {
    pollInterval: 60000, // Poll every minute,
    context: { apiName: ApolloEndpointsKeys.AMBRODEO_TOKENS }
  });

  const tokens = useMemo(() => data?.tokens || [], [data]);

  useEffect(() => {
    if (allRodeoTokens.length !== tokens.length) {
      onChangeRodeoTokens(tokens);
    }
  }, [tokens, allRodeoTokens, onChangeRodeoTokens]);

  return { tokens, loading };
}
