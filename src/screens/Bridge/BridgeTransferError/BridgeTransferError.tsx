import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './BridgeTransferError.styles';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { InfoIcon } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils';
import { COLORS } from '@constants/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { useBridgeContextData } from '@features/bridge/context';
import { DEFAULT_AMB_NETWORK } from '../../../features/bridge/constants';

export const BridgeTransferError = ({}) => {
  const navigation = useNavigation<HomeNavigationProp>();

  const { fromParams } = useBridgeContextData();

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
          fromParams.setter(DEFAULT_AMB_NETWORK);
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
