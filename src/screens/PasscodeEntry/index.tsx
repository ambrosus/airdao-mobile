import React, { useCallback, useRef } from 'react';
import { Alert, KeyboardAvoidingView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Passcode, PrimaryButton } from '@components/modular';
import { KeyboardDismissingView, Spacer, Text } from '@components/base';
import { usePreventGoingBack, useSupportedBiometrics } from '@hooks';
import { verticalScale } from '@utils/scaling';
import { PasscodeUtils } from '@utils/passcode';
import { COLORS } from '@constants/colors';
import usePasscode from '@contexts/Passcode';
import { RootNavigationProp } from '@appTypes';

export const PasscodeEntry = () => {
  const isAuthSuccessfulRef = useRef(false);
  usePreventGoingBack(isAuthSuccessfulRef);

  const navigation = useNavigation<RootNavigationProp>();
  const { t } = useTranslation();
  const { isFaceIDEnabled } = usePasscode();
  const supportedBiometrics = useSupportedBiometrics();
  const passcodeRef = useRef<TextInput>(null);

  useFocusEffect(() => {
    if (isFaceIDEnabled) {
      authenticateWithFaceID();
    } else {
      passcodeRef.current?.focus();
    }
  });

  const handlePasscode = async (typedPasscode: string[]) => {
    if (typedPasscode.length === 4) {
      const isPasscodeCorrect = await PasscodeUtils.verifyPasscode(
        typedPasscode
      );
      if (isPasscodeCorrect) {
        isAuthSuccessfulRef.current = true;
        navigation.pop();
      } else {
        Alert.alert(
          t('security.passcode.doesnt.match'),
          t('common.please.try.again'),
          [
            {
              text: t('try.again'),
              onPress: () => null,
              style: 'cancel'
            }
          ]
        );
      }
    }
  };

  const authenticateWithFaceID = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('security.authenticate.with.face.id'),
        fallbackLabel: t('security.enter.pin')
      });
      if (result.success) {
        isAuthSuccessfulRef.current = true;
        navigation.pop();
      } else {
        passcodeRef.current?.focus();
      }
    } catch (error) {
      // ignore
    }
  }, [navigation, t]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <KeyboardDismissingView disabled={isFaceIDEnabled}>
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
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
      {isFaceIDEnabled && (
        <PrimaryButton
          onPress={authenticateWithFaceID}
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
    </SafeAreaView>
  );
};
