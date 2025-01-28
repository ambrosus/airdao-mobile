import { useCallback } from 'react';
import { Cache, CacheKey } from '@lib/cache';
import { useWalletStore } from '../model/wallet-store';

export function useWalletPrivateKey() {
  const { wallet } = useWalletStore();

  const _extractPrivateKey = useCallback(async () => {
    return (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${wallet?._raw.hash ?? ''}`
    )) as string;
  }, [wallet]);

  return { _extractPrivateKey };
}
