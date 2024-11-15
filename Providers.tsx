import React from 'react';
import { combineComponents } from '@utils/combineComponents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListsContextProvider } from '@contexts/ListsContext';
import {
  AddWalletProvider,
  AllAddressesProvider,
  LocalizationProvider,
  PasscodeProvider
} from '@contexts';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from '@database';
import { BridgeContextProvider } from '@features/bridge/context';
import { SwapContextProvider } from '@features/swap/context';
import { KosmosMarketsContextProvider } from '@features/kosmos/context';
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

const WrappedPasscodeProvider: React.FC = ({ children }: any) => (
  <PasscodeProvider>{children}</PasscodeProvider>
);

const BridgeProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <BridgeContextProvider>{children}</BridgeContextProvider>
);

const KosmosMarketplaceProvider: React.FC = ({ children }: any) => (
  // @ts-ignore
  <KosmosMarketsContextProvider>{children}</KosmosMarketsContextProvider>
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
  BridgeProvider,
  KosmosMarketplaceProvider,
  SwapProvider,
  WalletConnectProvider
];

export const Providers = combineComponents(...providers);
