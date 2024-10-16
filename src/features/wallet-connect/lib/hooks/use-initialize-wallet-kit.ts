import { useCallback, useEffect } from 'react';
import { createWalletKit, walletKit } from '@features/wallet-connect/utils';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';
import { EXPO_PUBLIC_REOWN_PROJECT_ID } from '@env';
import { Alert } from 'react-native';

export function useInitializeWalletKit() {
  const { isWalletKitInitiated, setIsWalletKitInitiated, setActiveSessions } =
    useWalletConnectContextSelector();

  const onInitialize = useCallback(async () => {
    try {
      Alert.alert(EXPO_PUBLIC_REOWN_PROJECT_ID ?? 'no key found`');

      await createWalletKit();
      setIsWalletKitInitiated(true);

      if (walletKit) {
        setActiveSessions(Object.values(walletKit.getActiveSessions()));
      }
    } catch (error) {
      console.error('Error while initialize wallet kit:', error);
    }
  }, [setActiveSessions, setIsWalletKitInitiated]);

  useEffect(() => {
    if (!isWalletKitInitiated) onInitialize();
  }, [isWalletKitInitiated, onInitialize]);
}
