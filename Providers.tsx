import { FC, PropsWithChildren } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Config from '@constants/config';
import { LocalizationProvider } from '@contexts';
import { Database } from '@database';
import { BridgeContextProvider } from '@features/bridge/context';
import { SwapContextProvider } from '@features/swap/context';
import { WalletConnectContextProvider } from '@features/wallet-connect/context';
import { combineComponents } from '@utils';

const queryClient = new QueryClient();

const WrappedQueryClientProvider: FC = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const ApolloQueryProvider = ({ children }: PropsWithChildren) => {
  const client = new ApolloClient({
    uri: Config.CURRENCY_GRAPH_URL,
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const WrappedSafeAreaProvider: FC = ({ children }: PropsWithChildren) => (
  <SafeAreaProvider style={{ flex: 1 }}>{children}</SafeAreaProvider>
);

const WrappedLocalizationProvider: FC = ({ children }: PropsWithChildren) => (
  <LocalizationProvider>{children}</LocalizationProvider>
);

const LocalDBProvider: FC = ({ children }: PropsWithChildren) => (
  <DatabaseProvider database={Database.getDatabase()}>
    {children}
  </DatabaseProvider>
);

const BridgeProvider: FC = ({ children }: PropsWithChildren) => (
  // @ts-ignore
  <BridgeContextProvider>{children}</BridgeContextProvider>
);

const SwapProvider: FC = ({ children }: PropsWithChildren) => (
  // @ts-ignore
  <SwapContextProvider>{children}</SwapContextProvider>
);

const WalletConnectProvider: FC = ({ children }: PropsWithChildren) => (
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
