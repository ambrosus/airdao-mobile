import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { SecondaryButton } from '@components/modular';
import { Text } from '@components/base';
import {
  useWalletConnectContextSelector,
  useHandleBottomSheetActions
} from '@features/wallet-connect/lib/hooks';
import { COLORS } from '@constants/colors';

export const WalletConnectionFailedView = () => {
  const { t } = useTranslation();
  const { proposal } = useWalletConnectContextSelector();

  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const description = useMemo(() => {
    if (proposal && proposal.verifyContext.verified.origin) {
      return t('wallet.connect.description.error.with.path', {
        origin,
        interpolation: { escapeValue: false }
      });
    }

    return t('wallet.connect.description.error');
  }, [proposal, t]);

  return (
    <View style={styles.container}>
      <Text
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.black}
        style={styles.heading}
      >
        {t('wallet.connect.title.error')}
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
          {t('wallet.connect.button.approve')}
        </Text>
      </SecondaryButton>
    </View>
  );
};
