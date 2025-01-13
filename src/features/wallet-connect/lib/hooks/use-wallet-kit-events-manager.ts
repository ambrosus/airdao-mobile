import { useCallback, useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { AirDAOEventType } from '@appTypes';
import { Toast, ToastType } from '@components/modular';
import Config from '@constants/config';
import {
  CONNECT_VIEW_STEPS,
  SessionDeleteEvent,
  SessionProposalEvent,
  SessionRequestEvent,
  WALLET_CLIENT_EVENTS,
  WALLET_CORE_EVENTS
} from '@features/wallet-connect/types';
import { supportedChains, walletKit } from '@features/wallet-connect/utils';
import { AirDAOEventDispatcher } from '@lib';
import { delay } from '@utils';
import { useDecodeCallbackData } from './use-decode-callback';
import { useHandleBottomSheetActions } from './use-handle-bottom-sheet-actions';
import { useWalletConnectContextSelector } from './use-wallet-connect-context';

export function useWalletKitEventsManager(isWalletKitInitiated: boolean) {
  const { onShowWalletConnectBottomSheet } = useHandleBottomSheetActions();
  const {
    onChangeProposal,
    onChangeRequest,
    setWalletConnectStep,
    setActiveSessions
  } = useWalletConnectContextSelector();

  const { getTransactionParamsByBytes } = useDecodeCallbackData();

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

  const onSessionRequest = useCallback(
    async (event: SessionRequestEvent) => {
      const { topic } = event;
      const session = walletKit.engine.signClient.session.get(topic);

      const { requiredNamespaces, optionalNamespaces } = session;
      const chains = supportedChains(requiredNamespaces, optionalNamespaces);

      const _correctChainIds = chains.filter(
        (chain) => chain.id === Config.CHAIN_ID
      );

      if (chains.length > 0 || _correctChainIds.length === 0) {
        await getTransactionParamsByBytes(event.params.request.params[0].data);
        setWalletConnectStep(CONNECT_VIEW_STEPS.EIP155_TRANSACTION);
        onChangeRequest({ event, session });

        delay(1000);
        InteractionManager.runAfterInteractions(onShowWalletConnectBottomSheet);
      }
    },
    [
      getTransactionParamsByBytes,
      onChangeRequest,
      onShowWalletConnectBottomSheet,
      setWalletConnectStep
    ]
  );

  useEffect(() => {
    if (isWalletKitInitiated) {
      walletKit.on(WALLET_CORE_EVENTS.SESSION_PROPOSAL, onSessionProposal);
      walletKit.on(WALLET_CORE_EVENTS.SESSION_DELETE, onSessionDelete);
      walletKit.on(WALLET_CORE_EVENTS.SESSION_REQUEST, onSessionRequest);

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
    onSessionDelete,
    onSessionProposal,
    onSessionRequest
  ]);
}
