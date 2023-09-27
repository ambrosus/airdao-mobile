import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { KeyboardDismissingView, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { Alert, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Passcode } from '@components/base/Passcode/Passcode';
import { database } from '@database/main';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { useAppState, useForwardedRef } from '@hooks';
import { verticalScale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@components/templates/PasscodeModal/styles';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { PrimaryButton } from '@components/modular';

interface PasscodeModalProps {
  isPasscodeEnabled: boolean;
  isFaceIDEnabled: boolean;
}

export const PasscodeModal = forwardRef<
  BottomSheetRef,
  BottomSheetProps & PasscodeModalProps
>((props, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
  const { top, bottom } = useSafeAreaInsets();
  const { prevState } = useAppState();
  const { t } = useTranslation();
  const [savedPasscode, setSavedPasscode] = useState([]);
  const [userPasscode, setUserPasscode] = useState<string[]>([]);
  const [faceIDAuthRes, setFaceIDAuthRes] = useState<boolean>(true);

  useEffect(() => {
    // @ts-ignore
    database.localStorage.get('Passcode').then((res) => setSavedPasscode(res));
  }, []);

  const handlePasscode = (typedPasscode: string[]) => {
    if (typedPasscode.length === 4) {
      if (JSON.stringify(savedPasscode) === JSON.stringify(typedPasscode)) {
        localRef.current?.dismiss();
      } else {
        Alert.alert("Passcode doesn't match", 'Please try again', [
          {
            text: 'Try again',
            onPress: () => setUserPasscode([]),
            style: 'cancel'
          }
        ]);
      }
    } else {
      setUserPasscode(typedPasscode);
    }
  };

  useEffect(() => {
    if (JSON.stringify(savedPasscode) === JSON.stringify(userPasscode)) {
      localRef.current?.dismiss();
    }
  }, [localRef, userPasscode, savedPasscode]);

  const authenticateWithFaceID = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID',
        fallbackLabel: 'Enter PIN'
      });
      if (result.success) {
        setFaceIDAuthRes(true);
        localRef.current?.dismiss();
      } else {
        setFaceIDAuthRes(false);
      }
    } catch (error) {
      setFaceIDAuthRes(false);
      console.error('Authentication error:', error);
    }
  };

  useEffect(() => {
    if (props.isFaceIDEnabled && prevState === 'background') {
      authenticateWithFaceID();
    }
    if (props.isFaceIDEnabled && prevState === null) {
      setTimeout(() => {
        authenticateWithFaceID();
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isFaceIDEnabled, localRef, prevState]);

  return (
    <BottomSheet
      swipingEnabled={false}
      ref={localRef}
      containerStyle={styles.container}
      height={Dimensions.get('screen').height}
    >
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{
          top,
          flex: 1
        }}
      >
        <KeyboardDismissingView>
          <Text
            fontSize={24}
            fontFamily="Inter_700Bold"
            color={COLORS.neutral800}
            align="center"
            style={{ paddingTop: verticalScale(160) }}
          >
            {t('enter.your.passcode')}
          </Text>
          <Spacer value={verticalScale(24)} />
          <Passcode onPasscodeChange={handlePasscode} />
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
      {!faceIDAuthRes ? (
        <KeyboardDismissingView>
          <PrimaryButton
            onPress={authenticateWithFaceID}
            style={{
              width: '90%',
              alignSelf: 'center',
              bottom
            }}
          >
            <Text
              align="center"
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.neutral0}
            >
              Sign in with Face ID
            </Text>
          </PrimaryButton>
        </KeyboardDismissingView>
      ) : (
        <></>
      )}
    </BottomSheet>
  );
});
