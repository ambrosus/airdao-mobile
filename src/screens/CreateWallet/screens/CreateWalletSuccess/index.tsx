import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { Spacer, Text } from '@components/base';
import { SuccessIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { HomeNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import usePasscode from '@contexts/Passcode';
import { styles } from './CreateWalletSuccess.styles';

export const CreateWalletSuccess = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { isPasscodeEnabled } = usePasscode();

  const navigateToSetUpSecurity = () => {
    if (isPasscodeEnabled) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Tabs', params: { screen: 'Wallets' } }]
        })
      );
    } else {
      navigation.navigate('SetupPasscode');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SuccessIcon />
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {t('create.wallet.success')}
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('create.wallet.success.text')}
        </Text>
      </View>
      <BottomAwareSafeAreaView paddingBottom={verticalScale(26)}>
        <PrimaryButton onPress={navigateToSetUpSecurity}>
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral0}
          >
            {isPasscodeEnabled
              ? t('button.start.using.wallet')
              : t('button.setup.security')}
          </Text>
        </PrimaryButton>
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};
