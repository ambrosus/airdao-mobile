import { useMemo } from 'react';
import { useWalletStore } from '@entities/wallet';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

const EIP155Regex = /^eip155:\d+:/;

export function useConnectionsController() {
  const { wallet } = useWalletStore();
  const { activeSessions } = useWalletConnectContextSelector();

  return useMemo(() => {
    if (!wallet?.address) return [];

    return activeSessions.filter((session) =>
      session.namespaces.eip155.accounts
        .map((account) => account.replace(EIP155Regex, ''))
        .includes(wallet?.address)
    );
  }, [activeSessions, wallet?.address]);
}
