import React, { useCallback, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { RootNavigationProp } from '@appTypes';
import { useAllWallets } from '@hooks/database';
import usePasscode from '@contexts/Passcode';
import { Cache, CacheKey } from '@lib/cache';

const AppInitialization = () => {
  const { t } = useTranslation();
  const { data: allWallets, loading } = useAllWallets();
  const {
    isPasscodeEnabled,
    isFaceIDEnabled,
    loading: passcodeLoading
  } = usePasscode();
  const navigation = useNavigation<RootNavigationProp>();

  const initApp = useCallback(async () => {
    // reset passcode states
    await Cache.setItem(CacheKey.isSetupSecurityInProgress, false);
    await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
    if (!loading && !passcodeLoading) {
      if (allWallets.length > 0) {
        if (!isPasscodeEnabled && !isFaceIDEnabled) {
          navigation.replace('Tabs', {
            screen: 'Wallets',
            params: { screen: 'SetupPasscode' }
          });
        } else {
          navigation.replace('Passcode');
        }
      } else {
        navigation.replace('WelcomeScreen');
      }
    }
  }, [
    allWallets.length,
    isFaceIDEnabled,
    isPasscodeEnabled,
    loading,
    navigation,
    passcodeLoading
  ]);

  useEffect(() => {
    initApp();
  }, [
    initApp,
    allWallets.length,
    isFaceIDEnabled,
    isPasscodeEnabled,
    loading,
    navigation,
    passcodeLoading
  ]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/logo.png')}
        style={styles.logo}
        borderRadius={verticalScale(24)}
      />
      <Spacer value={verticalScale(12)} />
      <Text
        fontSize={24}
        fontFamily="Inter_700Bold"
        fontWeight="700"
        color={COLORS.neutral900}
      >
        {t('airdao.wallet')}
      </Text>
      <Spacer value={verticalScale(16)} />
      <Text
        align="center"
        fontSize={16}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral400}
      >
        {t('no.wallet.description')}
      </Text>
      <View style={styles.spinner}>
        <Spinner />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(74)
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brand500,
    borderRadius: verticalScale(36),
    height: verticalScale(132),
    width: verticalScale(132)
  },
  spinner: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: verticalScale(58)
  }
});

export default AppInitialization;
