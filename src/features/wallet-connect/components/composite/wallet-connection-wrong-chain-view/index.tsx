import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { SecondaryButton } from '@components/modular';
import { Text } from '@components/base';
import { useHandleBottomSheetActions } from '@features/wallet-connect/lib/hooks';
import { COLORS } from '@constants/colors';

export const WalletConnectionWrongChainView = () => {
  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

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

      <SecondaryButton
        onPress={onDismissWalletConnectBottomSheet}
        style={styles.secondaryButton}
      >
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
