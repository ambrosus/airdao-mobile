import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { BottomAwareSafeAreaView } from '@components/composite';

import { PrimaryButton } from '@components/modular';
import { SuccessIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';
import { usePasscodeActions } from '@features/passcode/lib/hooks';
import { useEffectOnce } from '@hooks';
import { scale, verticalScale } from '@utils';

export const SuccessSetupSecurity = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { t } = useTranslation();
  const { isFaceIDEnabled } = usePasscodeStore();
  const { onToggleBiometricAuth } = usePasscodeActions();

  useEffectOnce(() => {
    if (!isFaceIDEnabled) {
      onToggleBiometricAuth();
    }
  });

  const navigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Tabs', params: { screen: 'Wallets' } }]
      })
    );
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
          {t('security.enabled')}
        </Text>
        <Spacer value={verticalScale(12)} />
        <Text
          align="center"
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
        >
          {t('security.wallet.protected')}{' '}
          <Text fontFamily="Inter_600SemiBold">
            {t('tab.settings')}
            {'>'}
            {t('settings.security')}
          </Text>
          {t('security.manage')}
        </Text>
      </View>
      <BottomAwareSafeAreaView>
        <PrimaryButton
          onPress={navigateToHome}
          style={{
            paddingHorizontal: scale(16)
          }}
        >
          <Text
            align="center"
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral0}
          >
            {t('button.start.using.wallet')}
          </Text>
        </PrimaryButton>
      </BottomAwareSafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(27)
  }
});
