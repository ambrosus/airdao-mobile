import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types';
import { Text } from '@components/base';
import { TextOrSpinner } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useWalletPrivateKey } from '@entities/wallet';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';
import {
  approveEIP155Request,
  rejectEIP155Request,
  walletKit
} from '@features/wallet-connect/utils';
import { styles } from './styles';

export const WalletConnectTxApproval = () => {
  const { _extractPrivateKey } = useWalletPrivateKey();
  const { request: data, setWalletConnectStep } =
    useWalletConnectContextSelector();

  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);

  // Get request and wallet data from store
  const requestEvent = data?.event;
  const session = data?.session;

  const topic = requestEvent?.topic;
  const params = requestEvent?.params;
  const request = params?.request;

  const onApprove = useCallback(async () => {
    if (requestEvent && topic) {
      setIsLoadingApprove(true);
      try {
        const privateKey = await _extractPrivateKey();

        const response = await approveEIP155Request(
          requestEvent.id,
          requestEvent,
          privateKey
        );

        await walletKit.respondSessionRequest({
          topic,
          response: response as JsonRpcResponse
        });
      } catch (error) {
        throw error;
      }

      setIsLoadingApprove(false);
      onDismissWalletConnectBottomSheet();
      setWalletConnectStep(CONNECT_VIEW_STEPS.INITIAL);
    }
  }, [
    _extractPrivateKey,
    onDismissWalletConnectBottomSheet,
    requestEvent,
    setWalletConnectStep,
    topic
  ]);

  const onReject = useCallback(async () => {
    if (request && topic) {
      setIsLoadingReject(true);

      const response = rejectEIP155Request(requestEvent);

      try {
        await walletKit.respondSessionRequest({
          topic,
          response: response as JsonRpcResponse
        });
      } catch (error) {
        throw error;
      }
    }

    setIsLoadingReject(false);
    onDismissWalletConnectBottomSheet();
    setWalletConnectStep(CONNECT_VIEW_STEPS.INITIAL);
  }, [
    topic,
    request,
    requestEvent,
    setWalletConnectStep,
    onDismissWalletConnectBottomSheet
  ]);

  return (
    <View style={styles.container}>
      <Text>Approval tx - {session?.peer.metadata.url}</Text>

      <PrimaryButton onPress={onApprove}>
        <TextOrSpinner
          label="Approve"
          loading={isLoadingApprove}
          loadingLabel={undefined}
          styles={{ active: { color: COLORS.neutral0 } }}
        />
      </PrimaryButton>
      <PrimaryButton onPress={onReject}>
        <TextOrSpinner
          label="Cancel"
          loading={isLoadingReject}
          loadingLabel={undefined}
          styles={{ active: { color: COLORS.neutral0 } }}
        />
      </PrimaryButton>
    </View>
  );
};
