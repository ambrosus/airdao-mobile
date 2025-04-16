import Config from '@constants/config';

export enum ApolloEndpointsKeys {
  AMBRODEO_TOKENS = 'GRAPH_AMBRODEO_ENDPOINT',
  CURRENCY = 'GRAPH_CURRENCY_ENDPOINT'
}

export const ApolloEndpoints = {
  [ApolloEndpointsKeys.AMBRODEO_TOKENS]: Config.AMBRODEO_TOKENS_GRAPH_URL,
  [ApolloEndpointsKeys.CURRENCY]: Config.CURRENCY_GRAPH_URL
} as const;
