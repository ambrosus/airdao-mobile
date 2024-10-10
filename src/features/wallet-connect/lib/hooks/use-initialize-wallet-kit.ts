import { createWalletKit } from '@features/wallet-connect/utils';
import { useCallback, useEffect, useState } from 'react';

export function useInitializeWalletKit() {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    try {
      await createWalletKit();
      setInitialized(true);
    } catch (error) {
      console.error('Error while initialize wallet kit:', error);
    }
  }, []);

  useEffect(() => {
    if (!initialized) onInitialize();
  }, [initialized, onInitialize]);

  return initialized;
}
