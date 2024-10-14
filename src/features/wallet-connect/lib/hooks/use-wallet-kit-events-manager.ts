import { useCallback, useEffect } from 'react';
import { supportedChains, walletKit } from '@features/wallet-connect/utils';
import { Toast, ToastType } from '@components/modular';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';
import {
  CONNECT_VIEW_STEPS,
  SessionAuthenticateEvent,
  SessionProposalEvent,
  SessionRequestEvent,
  WALLET_CLIENT_EVENTS,
  WALLET_CORE_EVENTS
} from '@features/wallet-connect/types';
import { useHandleBottomSheetActions } from './use-handle-bottom-sheet-actions';
import { InteractionManager } from 'react-native';
import { AirDAOEventDispatcher } from '@lib';
import { AirDAOEventType } from '@appTypes';
import Config from '@constants/config';

export function useWalletKitEventsManager(isWalletKitInitiated: boolean) {
  const { onShowWalletConnectBottomSheet } = useHandleBottomSheetActions();
  const { onChangeProposal, setWalletConnectStep } =
    useWalletConnectContextSelector();

  const onSessionProposal = useCallback(
    (proposal: SessionProposalEvent) => {
      const {
        params: { requiredNamespaces, optionalNamespaces }
      } = proposal;

      const chains = supportedChains(requiredNamespaces, optionalNamespaces);

      const _correctChainIds = chains.filter(
        (chain) => chain.id === Config.CHAIN_ID
      );

      if (chains.length === 0) {
        Toast.show({
          type: ToastType.Failed,
          text: 'Chain Not found'
        });
      } else if (_correctChainIds.length === 0) {
        setWalletConnectStep(CONNECT_VIEW_STEPS.WRONG_CHAIN_ERROR);
        onChangeProposal(proposal);

        AirDAOEventDispatcher.dispatch(AirDAOEventType.CloseAllModals, null);

        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });

        InteractionManager.runAfterInteractions(onShowWalletConnectBottomSheet);
      } else {
        setWalletConnectStep(CONNECT_VIEW_STEPS.APPROVE);
        onChangeProposal(proposal);

        AirDAOEventDispatcher.dispatch(AirDAOEventType.CloseAllModals, null);

        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });

        InteractionManager.runAfterInteractions(onShowWalletConnectBottomSheet);
      }
    },
    [onChangeProposal, onShowWalletConnectBottomSheet, setWalletConnectStep]
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
    if (isWalletKitInitiated) {
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
  }, [
    isWalletKitInitiated,
    onSessionAuthenticate,
    onSessionProposal,
    onSessionRequest
  ]);
}
