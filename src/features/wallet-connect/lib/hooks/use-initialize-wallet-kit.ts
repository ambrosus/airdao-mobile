import { useCallback, useEffect } from 'react';
import { createWalletKit } from '@features/wallet-connect/utils';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

export function useInitializeWalletKit() {
  const { isWalletKitInitiated, setIsWalletKitInitiated } =
    useWalletConnectContextSelector();

  const onInitialize = useCallback(async () => {
    try {
      await createWalletKit();
      setIsWalletKitInitiated(true);
    } catch (error) {
      console.error('Error while initialize wallet kit:', error);
    }
  }, [setIsWalletKitInitiated]);

  useEffect(() => {
    if (!isWalletKitInitiated) onInitialize();
  }, [isWalletKitInitiated, onInitialize]);
}
