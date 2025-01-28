import { useCallback, useEffect } from 'react';
import {
  createWalletKit,
  validateAndFilterSessions,
  walletKit
} from '@features/wallet-connect/utils';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

export function useInitializeWalletKit() {
  const { isWalletKitInitiated, setIsWalletKitInitiated, setActiveSessions } =
    useWalletConnectContextSelector();

  const onInitialize = useCallback(async () => {
    try {
      await createWalletKit();
      setIsWalletKitInitiated(true);

      if (walletKit) {
        const allSessions = Object.values(walletKit.getActiveSessions());
        const validSessions = await validateAndFilterSessions(allSessions);
        setActiveSessions(validSessions);
      }
    } catch (error) {
      console.error('Error while initialize wallet kit:', error);
    }
  }, [setActiveSessions, setIsWalletKitInitiated]);

  useEffect(() => {
    if (!isWalletKitInitiated) onInitialize();
  }, [isWalletKitInitiated, onInitialize]);
}
