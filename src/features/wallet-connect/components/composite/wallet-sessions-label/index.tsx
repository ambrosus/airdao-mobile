import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { ConnectionChainsIcon } from '@components/svg/icons/v2';
import {
  useHandleBottomSheetActions,
  useConnectionsController
} from '@features/wallet-connect/lib/hooks';
import { styles } from './styles';

export const WalletSessionsLabel = () => {
  const { t } = useTranslation();
  const sessionsPerAddress = useConnectionsController();
  const { onShowActiveSessionBottomSheet } = useHandleBottomSheetActions();

  const onToggleActiveSessionsBottomSheet = useCallback(
    () => onShowActiveSessionBottomSheet(),
    [onShowActiveSessionBottomSheet]
  );

  return (
    <Pressable
      onPress={onToggleActiveSessionsBottomSheet}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.5 : 1 }
      ]}
    >
      <Row alignItems="center">
        <ConnectionChainsIcon />
        <Spacer horizontal value={4} />
        <Text fontSize={13} fontFamily="Inter_600SemiBold" color="#259974">
          {t('wallet.connect.label.connections', {
            connectionsLength: sessionsPerAddress.length
          })}
        </Text>
      </Row>
    </Pressable>
  );
};
