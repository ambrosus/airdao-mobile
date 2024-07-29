import React from 'react';
import { combineComponents } from '@utils/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListsContextProvider } from '@contexts/ListsContext';
import {
  AddWalletProvider,
  AllAddressesProvider,
  LocalizationProvider,
  PasscodeProvider,
  StakingContextProvider,
  WalletContextProvider
} from '@contexts';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from '@database';
import { BridgeContextProvider } from '@contexts/Bridge';
import { SwapContextProvider } from '@features/swap/context';

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

const WrappedPasscodeProvider: React.FC = ({ children }: any) => (
  <PasscodeProvider>{children}</PasscodeProvider>
);

const WalletProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <WalletContextProvider>{children}</WalletContextProvider>
);

const StakingProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <StakingContextProvider>{children}</StakingContextProvider>
);

const BridgeProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <BridgeContextProvider>{children}</BridgeContextProvider>
);

const SwapProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <SwapContextProvider>{children}</SwapContextProvider>
);

const independentProviders = [
  WrappedQueryClientProvider,
  WrappedSafeAreaProvider,
  WrappedLocalizationProvider,
  WrappedPasscodeProvider
];
/**
 * The order of the providers matters
 */
const providers = [
  ...independentProviders,
  LocalDBProvider,
  AllAddressesProvider,
  ListsContextProvider,
  WrappedLocalizationProvider,
  AddWalletProvider,
  WalletProvider,
  StakingProvider,
  BridgeProvider,
  SwapProvider
];

export const Providers = combineComponents(...providers);
