import { combineComponents } from '@helpers/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListsContextProvider } from '@contexts/ListsContext';
import { AllAddressesProvider } from '@contexts';
import { OnboardingContextProvider } from '@contexts/OnBoardingUserContext';

const queryClient = new QueryClient();

const WrappedQueryClientProvider: React.FC = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const WrappedSafeAreaProvider: React.FC = ({ children }: any) => (
  <SafeAreaProvider style={{ flex: 1 }}>{children}</SafeAreaProvider>
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
  AllAddressesProvider,
  ListsContextProvider,
  OnboardingContextProvider
];

export const Providers = combineComponents(...providers);
