import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { SecondaryButton } from '@components/modular';
import { Text } from '@components/base';
import {
  useWalletConnectContextSelector,
  useExtractProposalData
} from '@features/wallet-connect/lib/hooks';

import { useHandleBottomSheetActions } from '@features/wallet-connect/lib/hooks/use-handle-bottom-sheet-actions';
import { COLORS } from '@constants/colors';

export const WalletConnectionFailedView = () => {
  const { proposal } = useWalletConnectContextSelector();
  const { origin } = useExtractProposalData(proposal);
  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const description = useMemo(() => {
    if (proposal && origin) {
      return `We couldn’t connect to ${origin}. Try again later.`;
    }

    return 'We couldn’t connect. Try again later.';
  }, [origin, proposal]);

  return (
    <View style={styles.container}>
      <Text
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.black}
        style={styles.heading}
      >
        Connection failed
      </Text>
      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.foregroundSecondaryContent}
        style={styles.description}
      >
        {description}
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
