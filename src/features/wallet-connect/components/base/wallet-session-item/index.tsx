import React, { useCallback, useState } from 'react';
import { Pressable } from 'react-native';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { useTranslation } from 'react-i18next';
import { Row, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';
import { walletKit } from '@features/wallet-connect/utils';
import { styles } from './styles';

interface WalletSessionItemProps {
  index: number;
  connection: SessionTypes.Struct;
}

export const WalletSessionItem = ({
  index,
  connection
}: WalletSessionItemProps) => {
  const { t } = useTranslation();
  const { activeSessions, setActiveSessions } =
    useWalletConnectContextSelector();

  const { onDismissActiveSessionBottomSheet } = useHandleBottomSheetActions();

  const [disconnecting, setDisconnecting] = useState(false);

  const onRejectSession = useCallback(async () => {
    try {
      setDisconnecting(true);
      await walletKit.disconnectSession({
        topic: connection.topic,
        reason: getSdkError('USER_DISCONNECTED')
      });

      const filteredPairings = activeSessions.filter(
        (pairing) => pairing.topic !== connection.topic
      );

      if (filteredPairings.length === 0) {
        onDismissActiveSessionBottomSheet();
      }

      setActiveSessions(filteredPairings);
    } catch (error) {
      setActiveSessions((prevState) =>
        prevState.filter((_, sessionIndex) => sessionIndex !== index)
      );

      onDismissActiveSessionBottomSheet();
      throw error;
    } finally {
      setDisconnecting(false);
    }
  }, [
    index,
    activeSessions,
    connection.topic,
    setActiveSessions,
    onDismissActiveSessionBottomSheet
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
          disabled={disconnecting}
          onPress={onRejectSession}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          {disconnecting ? (
            <Spinner size="xs" />
          ) : (
            <Text
              fontSize={14}
              fontFamily="Inter_600SemiBold"
              color={COLORS.error500}
            >
              {t('wallet.connect.button.disconnect')}
            </Text>
          )}
        </Pressable>
      </Row>
    </Pressable>
  );
};
