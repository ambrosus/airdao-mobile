import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { InfoIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { DEFAULT_AMB_NETWORK } from '@features/bridge/constants';
import { useBridgeContextData } from '@features/bridge/context';
import { verticalScale } from '@utils';
import { styles } from './BridgeTransferError.styles';

export const BridgeTransferError = ({}) => {
  const navigation = useNavigation<HomeNavigationProp>();

  const { methods } = useBridgeContextData();
  const { setFrom } = methods;

  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <InfoIcon />
      <Spacer value={verticalScale(8)} />
      <Text color={COLORS.neutral800} fontSize={20} fontFamily="Inter_700Bold">
        {t('bridge.transfer.failed.header')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        color={COLORS.neutral400}
        fontSize={15}
        fontFamily="Inter_400Regular"
        align="center"
      >
        {t('bridge.transfer.failed.sub.header')}
      </Text>
      <PrimaryButton
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.button}
      >
        <Text color={COLORS.neutral0}>{t('button.try.again')}</Text>
      </PrimaryButton>
      <SecondaryButton
        onPress={() => {
          setFrom(DEFAULT_AMB_NETWORK);
          navigation.navigate('HomeScreen');
        }}
        style={styles.button}
      >
        <Text color={COLORS.neutral900}>
          {t('bridge.transfer.failed.to.wallet.btn')}
        </Text>
      </SecondaryButton>
    </SafeAreaView>
  );
};
