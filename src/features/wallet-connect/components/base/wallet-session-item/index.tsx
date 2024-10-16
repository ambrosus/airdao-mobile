import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { walletKit } from '@features/wallet-connect/utils';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';

interface WalletSessionItemProps {
  connection: SessionTypes.Struct;
}

export const WalletSessionItem = ({ connection }: WalletSessionItemProps) => {
  const { t } = useTranslation();
  const { activeSessions, setActiveSessions } =
    useWalletConnectContextSelector();

  const { onDismissActiveSessionBottomSheet } = useHandleBottomSheetActions();

  const onRejectSession = useCallback(async () => {
    try {
      await walletKit.disconnectSession({
        topic: connection.topic,
        reason: getSdkError('USER_DISCONNECTED')
      });

      const newPairings = activeSessions.filter(
        (pairing) => pairing.topic !== connection.topic
      );
      setActiveSessions(newPairings);
      onDismissActiveSessionBottomSheet();
    } catch (error) {
      throw error;
    }
  }, [
    activeSessions,
    connection.topic,
    onDismissActiveSessionBottomSheet,
    setActiveSessions
  ]);

  return (
    <Pressable>
      <Row
        style={styles.container}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.black}
          style={styles.origin}
          numberOfLines={1}
        >
          {connection.peer.metadata.url}
        </Text>

        <Pressable
          onPress={onRejectSession}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <Text
            fontSize={14}
            fontFamily="Inter_600SemiBold"
            color={COLORS.error500}
          >
            {t('wallet.connect.button.disconnect')}
          </Text>
        </Pressable>
      </Row>
    </Pressable>
  );
};
