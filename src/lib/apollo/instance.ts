import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloEndpoints, ApolloEndpointsKeys } from './endpoints';

const httpLink = createHttpLink({
  uri: ({ getContext }) => {
    const { apiName } = getContext();

    if (apiName === ApolloEndpointsKeys.AMBRODEO_TOKENS)
      return ApolloEndpoints[ApolloEndpointsKeys.AMBRODEO_TOKENS];

    if (apiName === ApolloEndpointsKeys.CURRENCY)
      return ApolloEndpoints[ApolloEndpointsKeys.CURRENCY];

    return ApolloEndpoints[ApolloEndpointsKeys.CURRENCY];
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
