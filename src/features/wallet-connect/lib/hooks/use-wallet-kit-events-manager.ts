import { useCallback, useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { supportedChains, walletKit } from '@features/wallet-connect/utils';
import { Toast, ToastType } from '@components/modular';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';
import {
  CONNECT_VIEW_STEPS,
  SessionDeleteEvent,
  SessionProposalEvent,
  WALLET_CLIENT_EVENTS,
  WALLET_CORE_EVENTS
} from '@features/wallet-connect/types';
import { useHandleBottomSheetActions } from './use-handle-bottom-sheet-actions';
import { AirDAOEventDispatcher } from '@lib';
import { AirDAOEventType } from '@appTypes';
import Config from '@constants/config';
import { delay } from '@utils/delay';

export function useWalletKitEventsManager(isWalletKitInitiated: boolean) {
  const { onShowWalletConnectBottomSheet } = useHandleBottomSheetActions();
  const { onChangeProposal, setWalletConnectStep, setActiveSessions } =
    useWalletConnectContextSelector();

  const onSessionProposal = useCallback(
    (proposal: SessionProposalEvent) => {
      AirDAOEventDispatcher.dispatch(AirDAOEventType.CloseAllModals, null);
      const {
        params: { requiredNamespaces, optionalNamespaces }
      } = proposal;

      const chains = supportedChains(requiredNamespaces, optionalNamespaces);

      const _correctChainIds = chains.filter(
        (chain) => chain.id === Config.CHAIN_ID
      );

      if (chains.length === 0 || _correctChainIds.length === 0) {
        setWalletConnectStep(CONNECT_VIEW_STEPS.WRONG_CHAIN_ERROR);
        onChangeProposal(proposal);

        delay(1000);
        InteractionManager.runAfterInteractions(onShowWalletConnectBottomSheet);
      } else {
        setWalletConnectStep(CONNECT_VIEW_STEPS.APPROVE);
        onChangeProposal(proposal);

        delay(1000);
        InteractionManager.runAfterInteractions(onShowWalletConnectBottomSheet);
      }
    },
    [onChangeProposal, onShowWalletConnectBottomSheet, setWalletConnectStep]
  );

  const onSessionDelete = useCallback(
    (event: SessionDeleteEvent) =>
      setActiveSessions((prevState) =>
        prevState.filter((session) => session.topic !== event.topic)
      ),
    [setActiveSessions]
  );

  useEffect(() => {
    if (isWalletKitInitiated) {
      walletKit.on(WALLET_CORE_EVENTS.SESSION_PROPOSAL, onSessionProposal);
      walletKit.on(WALLET_CORE_EVENTS.SESSION_DELETE, onSessionDelete);

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
  }, [isWalletKitInitiated, onSessionDelete, onSessionProposal]);
}
