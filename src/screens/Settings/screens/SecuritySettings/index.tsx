import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@components/composite';
import { Button, Row, Spacer, Switch, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { Toast, ToastPosition, ToastType } from '@components/modular';
import { ChevronRightIcon } from '@components/svg/icons';
import { SettingsTabNavigationProp } from '@appTypes';
import { PasscodeUtils } from '@utils/passcode';
import { useSupportedBiometrics } from '@hooks';
import { DeviceUtils } from '@utils/device';

export const SecuritySettingsScreen = () => {
  const { t } = useTranslation();
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const supportedBiometrics = useSupportedBiometrics();
  const navigation = useNavigation<SettingsTabNavigationProp>();

  const toggleBiometricAuthentication = async () => {
    try {
      if (isFaceIDEnabled) {
        await PasscodeUtils.setFaceIDStatusInDB(false);
        setIsFaceIDEnabled(false);
      } else {
        // check if device has biometric hardware
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        // device has registered biometrics data, either fingerprint or face id
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const hasFaceId = DeviceUtils.checkFaceIDExists(supportedBiometrics);
        const hasFingerprint =
          DeviceUtils.checkFingerprintExists(supportedBiometrics);

        if (hasHardware && isEnrolled) {
          // authenticate with biometrics
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: hasFaceId
              ? t('security.authenticate.with.face.id')
              : hasFingerprint
              ? t('security.authenticate.with.fingerprint')
              : 'Authenticate',
            fallbackLabel: t('security.enter.pin')
          });
          if (result.success) {
            await PasscodeUtils.setFaceIDStatusInDB(true);
            setIsFaceIDEnabled(true);
          }
        } else {
          // show error otherwise
          Toast.show({
            text: hasFaceId
              ? t('settings.security.face.id.not.available')
              : t('settings.security.fingerprint.not.available'),
            position: ToastPosition.Top,
            type: ToastType.Failed
          });
        }
      }
    } catch (error) {
      console.error('Face ID error:', error);
    }
  };

  useEffect(() => {
    const checkFaceIDStatus = async () => {
      const storedFaceID = await PasscodeUtils.getFaceIDStatusFromDB();
      setIsFaceIDEnabled(storedFaceID);
    };
    checkFaceIDStatus();
  }, []);

  const navigateToChangePasscode = useCallback(() => {
    navigation.navigate('ChangePasscode');
  }, [navigation]);

  return (
    <SafeAreaView>
      <Header title="Security" style={{ shadowColor: 'transparent' }} />
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
              <ChevronRightIcon scale={1.25} color={COLORS.neutral300} />
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
