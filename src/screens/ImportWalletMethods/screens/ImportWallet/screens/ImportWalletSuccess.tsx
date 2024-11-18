import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomAwareSafeAreaView } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { SuccessIcon } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { HomeNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';

export const ImportWalletSuccess = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { isPasscodeEnabled } = usePasscodeStore();

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
          {t('import.wallet.success')}
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('import.wallet.success.text')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: scale(24)
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
