import React, { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { Passcode, PrimaryButton } from '@components/modular';
import { KeyboardDismissingView, Spacer, Text } from '@components/base';
import {
  useAppState,
  usePreventGoingBack,
  useSupportedBiometrics
} from '@hooks';
import { verticalScale } from '@utils/scaling';
import { PasscodeUtils } from '@utils/passcode';
import { COLORS } from '@constants/colors';
import usePasscode from '@contexts/Passcode';
import { RootNavigationProp } from '@appTypes';
import { Cache, CacheKey } from '@lib/cache';
import { DeviceUtils } from '@utils/device';

export const PasscodeEntry = () => {
  const isAuthSuccessfulRef = useRef(false);
  usePreventGoingBack(isAuthSuccessfulRef);

  const navigation = useNavigation<RootNavigationProp>();
  const { t } = useTranslation();
  const { isFaceIDEnabled } = usePasscode();
  const supportedBiometrics = useSupportedBiometrics();
  const passcodeRef = useRef<TextInput>(null);
  const { appState } = useAppState();
  const automaticFaceIdCalled = useRef(false);

  const closePasscodeEntry = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      const canGoBack = navigation.canGoBack();
      if (canGoBack) navigation.pop();
      else {
        navigation.replace('Tabs', {
          screen: 'Wallets',
          params: { screen: 'HomeScreen' }
        });
      }
    }, 0);
  }, [navigation]);

  const authenticateWithBiometrics = useCallback(async () => {
    automaticFaceIdCalled.current = true;
    await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, true);
    try {
      const hasFaceId = await DeviceUtils.checkFaceIDExists();
      const hasFingerprint = await DeviceUtils.checkFingerprintExists();
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t(
          hasFaceId
            ? t('security.authenticate.with.face.id')
            : hasFingerprint
            ? t('security.authenticate.with.fingerprint')
            : 'Authenticate'
        ),
        fallbackLabel: t('security.enter.pin'),
        cancelLabel: t('button.cancel')
      });
      if (result.success) {
        isAuthSuccessfulRef.current = true;
        closePasscodeEntry();
      } else {
        passcodeRef.current?.focus();
      }
    } catch (error) {
      // ignore
    } finally {
      await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
    }
  }, [closePasscodeEntry, t]);

  useEffect(() => {
    if (automaticFaceIdCalled.current) {
      return;
    }
    if (appState === 'active') {
      if (isFaceIDEnabled) {
        authenticateWithBiometrics();
      } else {
        passcodeRef.current?.focus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  const handlePasscode = async (typedPasscode: string[]) => {
    if (typedPasscode.length === 4) {
      const isPasscodeCorrect = await PasscodeUtils.verifyPasscode(
        typedPasscode
      );
      if (isPasscodeCorrect) {
        isAuthSuccessfulRef.current = true;
        closePasscodeEntry();
      } else {
        Alert.alert(
          t('security.passcode.doesnt.match'),
          t('common.please.try.again'),
          [
            {
              text: t('button.try.again'),
              onPress: () => null,
              style: 'cancel'
            }
          ]
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        enabled={DeviceUtils.isIOS}
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <KeyboardDismissingView
          style={{ flex: 1, justifyContent: 'space-between' }}
        >
          <View style={{ flex: 1 }}>
            <Text
              fontSize={24}
              fontFamily="Inter_700Bold"
              color={COLORS.neutral800}
              align="center"
              style={{ paddingTop: verticalScale(160) }}
            >
              {t('login.enter.your.passcode')}
            </Text>
            <Spacer value={verticalScale(24)} />
            <Passcode
              ref={passcodeRef}
              onPasscodeChange={handlePasscode}
              type="change"
            />
          </View>
          {isFaceIDEnabled && (
            <PrimaryButton
              onPress={authenticateWithBiometrics}
              style={{
                marginBottom: '5%',
                width: '90%',
                alignSelf: 'center'
              }}
            >
              <Text
                align="center"
                fontFamily="Inter_500Medium"
                fontSize={16}
                color={COLORS.neutral0}
              >
                {supportedBiometrics.indexOf(
                  LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
                ) > -1
                  ? t('login.with.face.id')
                  : t('login.with.fingerprint')}
              </Text>
            </PrimaryButton>
          )}
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
