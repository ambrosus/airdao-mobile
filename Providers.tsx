import React from 'react';
import { combineComponents } from '@utils/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from '@contexts';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from '@database';
import { BridgeContextProvider } from '@features/bridge/context';
import { SwapContextProvider } from '@features/swap/context';
import { WalletConnectContextProvider } from '@features/wallet-connect/context';

const queryClient = new QueryClient();

const WrappedQueryClientProvider: React.FC = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

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
