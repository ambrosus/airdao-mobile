import { useEffect, useMemo } from 'react';
import { useWalletStore } from '@entities/wallet';
import { useAppFocus } from '@hooks';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

const EIP155Regex = /^eip155:\d+:/;

export function useConnectionsController() {
  const { wallet } = useWalletStore();
  const { activeSessions, setActiveSessions } =
    useWalletConnectContextSelector();
  const active = useAppFocus();

  useEffect(() => {
    if (!wallet?.address) return;

    if (active)
      setActiveSessions((prevState) =>
        prevState.filter((session) =>
          session.namespaces.eip155.accounts
            .map((account) => account.replace(EIP155Regex, ''))
            .includes(wallet?.address)
        )
      );
  }, [active, setActiveSessions, wallet?.address]);

  return useMemo(() => {
    if (!wallet?.address) return [];

    return activeSessions.filter((session) =>
      session.namespaces.eip155.accounts
        .map((account) => account.replace(EIP155Regex, ''))
        .includes(wallet?.address)
    );
  }, [activeSessions, wallet?.address]);
}
