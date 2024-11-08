import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { getSdkError, buildApprovedNamespaces } from '@walletconnect/utils';
import { styles } from './styles';
import { Row, Spacer, Spinner, Text } from '@components/base';
import {
  useWalletConnectContextSelector,
  useExtractProposalData,
  useHandleBottomSheetActions
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
import {
  CONNECT_VIEW_STEPS,
  EIP155_SIGNING_METHODS
} from '@features/wallet-connect/types';
import { useTranslation } from 'react-i18next';

export const WalletConnectApprovalView = () => {
  const { t } = useTranslation();
  const { wallet } = useWallet();
  const { proposal, setActiveSessions, setWalletConnectStep } =
    useWalletConnectContextSelector();
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
        text: t('wallet.connect.title.success'),
        subtext: t('wallet.connect.description.success', {
          network: extractedHttpsOrigin,
          interpolation: { escapeValue: false }
        }),
        type: ToastType.Success
      });
    }, 500);
  }, [origin, t]);

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

        setActiveSessions(Object.values(walletKit.getActiveSessions()));

        onDismissWalletConnectBottomSheet();
        onShowToastNotification();
      } catch (error) {
        setWalletConnectStep(CONNECT_VIEW_STEPS.CONNECT_ERROR);
        console.error('Auth error:', error);
      } finally {
        setIsLoadingApprove(false);
      }
    }
  }, [
    proposal,
    supportedNamespaces,
    setActiveSessions,
    onDismissWalletConnectBottomSheet,
    onShowToastNotification,
    setWalletConnectStep
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
                {t('wallet.connect.pending.status')}
              </Text>
            </Row>
          </SecondaryButton>
        ) : (
          <>
            <PrimaryButton onPress={onApproveSession}>
              <Text color={COLORS.neutral0}>
                {t('wallet.connect.button.connect')}
              </Text>
            </PrimaryButton>

            <SecondaryButton style={styles.secondaryButton} onPress={onReject}>
              <Text color={COLORS.brand600}>
                {t('wallet.connect.button.cancel')}
              </Text>
            </SecondaryButton>
          </>
        )}
      </>
    );
  }, [isLoadingApprove, onApproveSession, onReject, t]);

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.black}
      >
        {t('wallet.connect.proposal', {
          origin,
          interpolation: { escapeValue: false }
        })}
      </Text>

      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.foregroundSecondaryContent}
        style={styles.description}
      >
        {t('wallet.connect.warning', {
          origin,
          interpolation: { escapeValue: false }
        })}
      </Text>
      <Spacer value={verticalScale(8)} />

      <View style={styles.footer}>{RenderFooterNode()}</View>
    </View>
  );
};