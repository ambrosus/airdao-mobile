import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { getSdkError, buildApprovedNamespaces } from '@walletconnect/utils';
import { styles } from './styles';
import { Row, Spacer, Spinner, Text } from '@components/base';
import {
  useWalletConnectContextSelector,
  useExtractProposalData
} from '@features/wallet-connect/lib/hooks';

import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import {
  PrimaryButton,
  SecondaryButton,
  Toast,
  ToastType
} from '@components/modular';
import { EIP155_CHAINS, walletKit } from '@features/wallet-connect/utils';
import { useWallet } from '@hooks';
import { EIP155_SIGNING_METHODS } from '@features/wallet-connect/types';
import { useHandleBottomSheetActions } from '@features/wallet-connect/lib/hooks/use-handle-bottom-sheet-actions';

export const WalletConnectApprovalView = () => {
  const { wallet } = useWallet();
  const { proposal } = useWalletConnectContextSelector();
  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();
  const { origin } = useExtractProposalData(proposal);

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);

  const supportedNamespaces = useMemo(() => {
    const eip155Chains = Object.keys(EIP155_CHAINS).map(
      (chain) => `eip155:${chain}`
    );

    const eip155Methods = Object.values(EIP155_SIGNING_METHODS);

    return {
      eip155: {
        chains: eip155Chains,
        methods: eip155Methods,
        events: ['accountsChanged', 'chainChanged'],
        accounts: eip155Chains
          .map((chain) => `${chain}:${wallet?.address}`)
          .flat()
      }
    };
  }, [wallet?.address]);

  const description = useMemo(() => {
    return `Are you sure you want to connect your wallet to ${origin}`;
  }, [origin]);

  const onReject = useCallback(async () => {
    if (proposal) {
      try {
        await walletKit.rejectSession({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED_METHODS')
        });
      } catch (error) {
        throw error;
      } finally {
        onDismissWalletConnectBottomSheet();
      }
    }
  }, [proposal, onDismissWalletConnectBottomSheet]);

  const onShowToastNotification = useCallback(() => {
    const extractedHttpsOrigin = origin.replace(/^https?:\/\//, '');

    return setTimeout(() => {
      Toast.show({
        text: 'Wallet connected!',
        subtext: `You're now connected to ${extractedHttpsOrigin}`,
        type: ToastType.Success
      });
    }, 500);
  }, [origin]);

  const onApproveSession = useCallback(async () => {
    if (proposal) {
      setIsLoadingApprove(true);
      const namespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces
      });

      try {
        await walletKit.approveSession({
          id: proposal.id,
          namespaces
        });

        onDismissWalletConnectBottomSheet();
        onShowToastNotification();
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsLoadingApprove(false);
      }
    }
  }, [
    onDismissWalletConnectBottomSheet,
    onShowToastNotification,
    proposal,
    supportedNamespaces
  ]);

  const RenderFooterNode = useCallback(() => {
    return (
      <>
        {isLoadingApprove ? (
          <SecondaryButton
            disabled
            style={styles.secondaryButton}
            onPress={onReject}
          >
            <Row alignItems="center" style={styles.loadingApproveNodeRow}>
              <Spinner size="xs" />
              <Text
                fontSize={17}
                fontFamily="Inter_600SemiBold"
                color={COLORS.brand600}
              >
                Connecting
              </Text>
            </Row>
          </SecondaryButton>
        ) : (
          <>
            <PrimaryButton onPress={onApproveSession}>
              <Text color={COLORS.neutral0}>Connect</Text>
            </PrimaryButton>

            <SecondaryButton style={styles.secondaryButton} onPress={onReject}>
              <Text color={COLORS.brand600}>Cancel</Text>
            </SecondaryButton>
          </>
        )}
      </>
    );
  }, [isLoadingApprove, onApproveSession, onReject]);

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.black}
      >
        Connect to {origin}
      </Text>

      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.foregroundSecondaryContent}
        style={styles.description}
      >
        {description}
      </Text>
      <Spacer value={verticalScale(8)} />

      <View style={styles.footer}>{RenderFooterNode()}</View>
    </View>
  );
};
