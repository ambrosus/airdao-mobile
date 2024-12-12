import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { Header } from '@components/composite';
import { Button, Row, Spacer, Switch, Text } from '@components/base';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { SettingsTabNavigationProp } from '@appTypes';
import { useSupportedBiometrics } from '@hooks';
import { usePasscodeStore } from '@features/passcode';
import { usePasscodeActions } from '@features/passcode/lib/hooks';

export const SecuritySettingsScreen = () => {
  const { t } = useTranslation();
  const supportedBiometrics = useSupportedBiometrics();
  const { isFaceIDEnabled } = usePasscodeStore();
  const { onToggleBiometricAuth } = usePasscodeActions();
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
            style={styles.container}
          >
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral900}
            >
              {t('settings.security.change.passcode')}
            </Text>
            <Row alignItems="center">
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
              fontFamily="Inter_500Medium"
              color={COLORS.neutral900}
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
                onValueChange={onToggleBiometricAuth}
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
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.neutral100
  }
});
