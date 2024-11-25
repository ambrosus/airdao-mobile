import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { SecondaryButton } from '@components/modular';
import { Text } from '@components/base';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';
import { COLORS } from '@constants/colors';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';

export const WalletConnectionWrongChainView = () => {
  const { setWalletConnectStep } = useWalletConnectContextSelector();
  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const onRejectConnect = useCallback(() => {
    setWalletConnectStep(CONNECT_VIEW_STEPS.INITIAL);
    onDismissWalletConnectBottomSheet();
  }, [onDismissWalletConnectBottomSheet, setWalletConnectStep]);

  return (
    <View style={styles.container}>
      <Text
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.black}
        style={styles.heading}
      >
        Wrong Network
      </Text>
      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.foregroundSecondaryContent}
        style={styles.description}
      >
        Switch to the correct chain and try again.
      </Text>

      <SecondaryButton onPress={onRejectConnect} style={styles.secondaryButton}>
        <Text
          fontSize={17}
          fontFamily="Inter_600SemiBold"
          color={COLORS.brand600}
        >
          Got it
        </Text>
      </SecondaryButton>
    </View>
  );
};
