import { useCallback, useEffect } from 'react';
import { supportedChains, walletKit } from '@features/wallet-connect/utils';
import { Toast, ToastType } from '@components/modular';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';
import {
  SessionAuthenticateEvent,
  SessionProposalEvent,
  SessionRequestEvent,
  WALLET_CLIENT_EVENTS,
  WALLET_CORE_EVENTS
} from '@features/wallet-connect/types';

export function useWalletKitEventsManager(initialized: boolean) {
  const { approvalConnectionBottomSheetRef, onChangeProposal } =
    useWalletConnectContextSelector();

  const onSessionProposal = useCallback(
    (proposal: SessionProposalEvent) => {
      const {
        params: { requiredNamespaces, optionalNamespaces }
      } = proposal;

      const chains = supportedChains(requiredNamespaces, optionalNamespaces);

      if (chains.length === 0) {
        Toast.show({
          type: ToastType.Failed,
          text: 'Chain Not found'
        });
      } else {
        onChangeProposal(proposal);
        approvalConnectionBottomSheetRef.current?.show();
      }
    },
    [approvalConnectionBottomSheetRef, onChangeProposal]
  );

  const onSessionRequest = useCallback((requestEvent: SessionRequestEvent) => {
    console.warn('onSessionRequest', requestEvent);
  }, []);

  const onSessionAuthenticate = useCallback(
    (authEvent: SessionAuthenticateEvent) => {
      console.warn('onSessionAuthenticate', authEvent);
    },
    []
  );

  useEffect(() => {
    if (initialized) {
      // Sign Events Handler
      walletKit.on(WALLET_CORE_EVENTS.SESSION_PROPOSAL, onSessionProposal);
      walletKit.on(WALLET_CORE_EVENTS.SESSION_REQUEST, onSessionRequest);
      // Auth Events Handler
      walletKit.on(
        WALLET_CORE_EVENTS.SESSION_AUTHENTICATE,
        onSessionAuthenticate
      );

      walletKit.engine.signClient.events.on(
        WALLET_CLIENT_EVENTS.SESSION_PING,
        () => {
          Toast.show({
            type: ToastType.Information,
            text: 'Session ping received'
          });
        }
      );
    }
  }, [initialized, onSessionAuthenticate, onSessionProposal, onSessionRequest]);
}
