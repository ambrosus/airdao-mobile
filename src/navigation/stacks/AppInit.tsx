import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { useSelectedWalletHash } from '@hooks';
import { RootNavigationProp } from '@appTypes';

const AppInitialization = () => {
  const { t } = useTranslation();
  const { data: hash, loading } = useSelectedWalletHash();
  const navigation = useNavigation<RootNavigationProp>();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
      if (hash) {
        navigation.replace('Tabs', {
          screen: 'Wallets',
          params: { screen: 'HomeScreen' }
        });
      } else {
        navigation.replace('WelcomeScreen');
      }
    }
  }, [loading, hash, navigation]);

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
    backgroundColor: COLORS.blue500,
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
