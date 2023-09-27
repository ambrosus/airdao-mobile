import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { Row, Spacer, Switch, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { database } from '@database/main';
import * as LocalAuthentication from 'expo-local-authentication';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';
import { Toast, ToastPosition, ToastType } from '@components/modular';

export const SecuritySettingsScreen = () => {
  const { t } = useTranslation();
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);

  const toggleFaceIDAuthentication = async () => {
    try {
      if (isFaceIDEnabled) {
        await database.localStorage.set('FaceID', false);
        setIsFaceIDEnabled(false);
      } else {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const availableTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (
          availableTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          ) &&
          hasHardware &&
          isEnrolled
        ) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate with Face ID',
            fallbackLabel: 'Enter PIN'
          });
          if (result.success) {
            await database.localStorage.set('FaceID', true);
            setIsFaceIDEnabled(true);
          }
        } else {
          Toast.show({
            text: 'Face ID is not available on this device',
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
      const storedFaceID = await database.localStorage.get('FaceID');
      setIsFaceIDEnabled(!!storedFaceID);
    };
    checkFaceIDStatus();
  }, []);

  return (
    <SafeAreaView>
      <Header title="Security" style={{ shadowColor: 'transparent' }} />
      <Spacer value={verticalScale(12)} />
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
              value={isFaceIDEnabled}
              onValueChange={toggleFaceIDAuthentication}
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
