import { useEffect, useMemo } from 'react';
import { AppState } from 'react-native';
import { useWalletStore } from '@entities/wallet';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';
import { walletKit } from '../wc.core';

const EIP155Regex = /^eip155:\d+:/;

export function useConnectionsController() {
  const { wallet } = useWalletStore();
  const { activeSessions, setActiveSessions } =
    useWalletConnectContextSelector();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setActiveSessions(Object.values(walletKit.getActiveSessions()));
      }
    });

    return () => {
      subscription.remove();
    };
  }, [activeSessions, setActiveSessions, wallet?.address]);

  return useMemo(() => {
    return activeSessions.filter((session) =>
      session.namespaces.eip155.accounts
        .map((account) => account.replace(EIP155Regex, ''))
        .includes(wallet?.address ?? '')
    );
  }, [activeSessions, wallet?.address]);
}
