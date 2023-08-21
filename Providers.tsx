import React from 'react';
import { combineComponents } from '@helpers/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListsContextProvider } from '@contexts/ListsContext';
import {
  AllAddressesProvider,
  OnboardingContextProvider,
  LocalizationProvider
} from '@contexts';

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
  AllAddressesProvider,
  ListsContextProvider,
  WrappedLocalizationProvider,
  OnboardingContextProvider
];

export const Providers = combineComponents(...providers);
