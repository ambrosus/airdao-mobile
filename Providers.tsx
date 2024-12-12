import React from 'react';
import { combineComponents } from '@utils/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from '@contexts';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from '@database';
import { BridgeContextProvider } from '@features/bridge/context';
import { SwapContextProvider } from '@features/swap/context';
import { WalletConnectContextProvider } from '@features/wallet-connect/context';
import Config from '@constants/config';

const queryClient = new QueryClient();

const WrappedQueryClientProvider: React.FC = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const ApolloQueryProvider = ({ children }: any) => {
  const client = new ApolloClient({
    uri: Config.CURRENCY_GRAPH_URL,
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const WrappedSafeAreaProvider: React.FC = ({ children }: any) => (
  <SafeAreaProvider style={{ flex: 1 }}>{children}</SafeAreaProvider>
);

const WrappedLocalizationProvider: React.FC = ({ children }: any) => (
  <LocalizationProvider>{children}</LocalizationProvider>
);

const LocalDBProvider: React.FC = ({ children }: any) => (
  <DatabaseProvider database={Database.getDatabase()}>
    {children}
  </DatabaseProvider>
);

const BridgeProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <BridgeContextProvider>{children}</BridgeContextProvider>
);

const SwapProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <SwapContextProvider>{children}</SwapContextProvider>
);

const WalletConnectProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <WalletConnectContextProvider>{children}</WalletConnectContextProvider>
);

const independentProviders = [
  WrappedQueryClientProvider,
  ApolloQueryProvider,
  WrappedSafeAreaProvider,
  WrappedLocalizationProvider
];
/**
 * The order of the providers matters
 */
const providers = [
  ...independentProviders,
  LocalDBProvider,
  WrappedLocalizationProvider,
  BridgeProvider,
  SwapProvider,
  WalletConnectProvider
];

export const Providers = combineComponents(...providers);
