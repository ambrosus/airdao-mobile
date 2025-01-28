import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@components/base';
import { SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import {
  useWalletConnectContextSelector,
  useHandleBottomSheetActions
} from '@features/wallet-connect/lib/hooks';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';
import { styles } from './styles';

export const WalletConnectionFailedView = () => {
  const { t } = useTranslation();
  const { proposal, setWalletConnectStep } = useWalletConnectContextSelector();

  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const description = useMemo(() => {
    if (proposal) {
      return t('wallet.connect.description.error.with.path', {
        origin: proposal?.params.proposer.metadata.url,
        interpolation: { escapeValue: false }
      });
    }

    return t('wallet.connect.description.error');
  }, [proposal, t]);

  const onRejectConnect = useCallback(() => {
    onDismissWalletConnectBottomSheet();
    setWalletConnectStep(CONNECT_VIEW_STEPS.INITIAL);
  }, [onDismissWalletConnectBottomSheet, setWalletConnectStep]);

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

      <SecondaryButton onPress={onRejectConnect} style={styles.secondaryButton}>
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
