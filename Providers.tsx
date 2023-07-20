import React from 'react';
import { combineComponents } from '@helpers/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListsContextProvider } from '@contexts/ListsContext';
import {
  AddWalletProvider,
  AllAddressesProvider,
  OnboardingContextProvider
} from '@contexts';
import { Database } from '@database';

const queryClient = new QueryClient();

const WrappedQueryClientProvider: React.FC = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const WrappedSafeAreaProvider: React.FC = ({ children }: any) => (
  <SafeAreaProvider style={{ flex: 1 }}>{children}</SafeAreaProvider>
);

const LocalDBProvider: React.FC = ({ children }: any) => (
  <DatabaseProvider database={Database.getDatabase()}>
    {children}
  </DatabaseProvider>
);

const independentProviders = [
  WrappedQueryClientProvider,
  WrappedSafeAreaProvider
];
/**
 * The order of the providers matters
 */
const providers = [
  ...independentProviders,
  LocalDBProvider,
  AllAddressesProvider,
  ListsContextProvider,
  OnboardingContextProvider,
  AddWalletProvider
];

export const Providers = combineComponents(...providers);
