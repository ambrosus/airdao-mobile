import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@components/composite';
import { Button, Row, Spacer, Switch, Text } from '@components/base';
import { ChevronDownIcon } from '@components/svg/icons';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { SettingsTabNavigationProp } from '@appTypes';
import { useSupportedBiometrics } from '@hooks';
import usePasscode from '@contexts/Passcode';

export const SecuritySettingsScreen = () => {
  const { t } = useTranslation();
  const supportedBiometrics = useSupportedBiometrics();
  const { toggleBiometricAuthentication, isFaceIDEnabled } = usePasscode();
  const navigation = useNavigation<SettingsTabNavigationProp>();

  const navigateToChangePasscode = useCallback(() => {
    navigation.navigate('ChangePasscode');
  }, [navigation]);

  return (
    <SafeAreaView>
      <Header
        bottomBorder
        title="Security"
        style={{ shadowColor: 'transparent' }}
      />
      <Spacer value={verticalScale(12)} />
      <Button onPress={navigateToChangePasscode}>
        <View style={{ paddingHorizontal: scale(18) }}>
          <Row
            alignItems="center"
            justifyContent="space-between"
            style={styles.secondContainer}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral500}
            >
              {t('settings.security.change.passcode')}
            </Text>
            <Row alignItems="center">
              <ChevronDownIcon rotate="270deg" color={COLORS.neutral300} />
              <Spacer value={scale(8)} horizontal />
            </Row>
          </Row>
        </View>
      </Button>
      <Spacer value={verticalScale(16)} />
      {supportedBiometrics.length > 0 && (
        <View style={{ paddingHorizontal: scale(18) }}>
          <Row
            alignItems="center"
            justifyContent="space-between"
            style={styles.container}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral500}
            >
              {supportedBiometrics.indexOf(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
              ) > -1
                ? t('login.with.face.id')
                : t('login.with.fingerprint')}
            </Text>
            <Row alignItems="center">
              <Switch
                value={isFaceIDEnabled}
                onValueChange={toggleBiometricAuthentication}
              />
            </Row>
          </Row>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: moderateScale(16)
  },
  secondContainer: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: moderateScale(16)
  }
});
