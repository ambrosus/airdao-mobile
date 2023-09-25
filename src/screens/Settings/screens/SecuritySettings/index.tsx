import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { Row, Switch, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { database } from '@database/main';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform, StyleSheet, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';
// import { Toast, ToastPosition, ToastType } from '@components/modular';

export const SecuritySettingsScreen = () => {
  const { t } = useTranslation();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);

  // TODO modify to setup keys to localstorage db for diff types of biometrics
  const toggleBiometricAuthentication = async () => {
    try {
      if (isBiometricEnabled) {
        await database.localStorage.set('FaceID', false);
        setIsBiometricEnabled(false);
      } else {
        const availableTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (
          availableTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Face ID'
          });
          if (result.success) {
            await database.localStorage.set('FaceID', true);
            setIsBiometricEnabled(true);
          }
          setBiometricType('Face ID');
        } else if (
          availableTypes.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT
          )
        ) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Fingerprint'
          });
          if (result.success) {
            await database.localStorage.set('FaceID', true);
            setIsBiometricEnabled(true);
          }
          setBiometricType('Fingerprint');
        } else {
          setBiometricType(null);
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
    }
  };

  useEffect(() => {
    const checkBiometricStatus = async () => {
      const storedBiometric = await database.localStorage.get('Biometric');
      setIsBiometricEnabled(!!storedBiometric);
    };
    checkBiometricStatus();
  }, []);

  useEffect(() => {
    const checkBiometricType = async () => {
      if (Platform.OS === 'ios') {
        const availableTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          availableTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType('Face ID');
        } else if (
          availableTypes.includes(
            LocalAuthentication.AuthenticationType.FINGERPRINT
          )
        ) {
          setBiometricType('Fingerprint');
        } else {
          setBiometricType(null);
        }
      }
    };
    checkBiometricType();
  }, []);

  return (
    <SafeAreaView>
      <Header title="Security" style={{ shadowColor: 'transparent' }} />
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
            {t('sign.in.with.face.id')}
          </Text>
          <Row alignItems="center">
            <Switch
              value={isBiometricEnabled}
              onValueChange={toggleBiometricAuthentication}
            />
          </Row>
        </Row>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: moderateScale(16)
  }
});
