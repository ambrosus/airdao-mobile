import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { KeyboardDismissingView, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef
} from '@components/composite';
import { useAppState, useForwardedRef, useSupportedBiometrics } from '@hooks';
import { verticalScale } from '@utils/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@components/templates/PasscodeModal/styles';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import { Passcode, PrimaryButton } from '@components/modular';
import usePasscode from '@contexts/Passcode';
import { PasscodeUtils } from '@utils/passcode';

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
  const { isFaceIDEnabled } = usePasscode();
  const supportedBiometrics = useSupportedBiometrics();
  const passcodeRef = useRef<TextInput>(null);

  const [faceIDAuthRes, setFaceIDAuthRes] = useState<boolean>(true);
  const isAuthenticating = useRef(false);

  const handlePasscode = (typedPasscode: string[]) => {
    if (typedPasscode.length === 4) {
      PasscodeUtils.getPasscodeFromDB().then((databasePasscode) => {
        if (
          JSON.stringify(databasePasscode) === JSON.stringify(typedPasscode)
        ) {
          localRef.current?.dismiss();
        } else {
          Alert.alert(t('passcode.doesnt.match'), t('please.try.again'), [
            {
              text: t('try.again'),
              onPress: () => null,
              style: 'cancel'
            }
          ]);
        }
      });
    }
  };

  const authenticateWithFaceID = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('authenticate.with.face.id'),
        fallbackLabel: t('enter.pin')
      });
      LocalAuthentication.authenticateAsync({});
      if (result.success) {
        setFaceIDAuthRes(true);
        localRef.current?.dismiss();
      } else {
        setFaceIDAuthRes(false);
        passcodeRef.current?.focus();
      }
    } catch (error) {
      setFaceIDAuthRes(false);
      console.error('Authentication error:', error);
    } finally {
      isAuthenticating.current = false;
    }
  }, [localRef, t]);

  useEffect(() => {
    if (prevState === 'background' || prevState === null) {
      if (props.isFaceIDEnabled) authenticateWithFaceID();
      else passcodeRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.isFaceIDEnabled,
    prevState,
    passcodeRef.current, // is required, not focusing on the input otherwise
    authenticateWithFaceID
  ]);

  return (
    <BottomSheet
      swipingEnabled={false}
      ref={localRef}
      containerStyle={styles.container}
      height={Dimensions.get('screen').height}
      closeOnBackPress={false}
    >
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{
          top,
          flex: 1
        }}
      >
        <KeyboardDismissingView disabled={!isFaceIDEnabled}>
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
          <Passcode
            ref={passcodeRef}
            onPasscodeChange={handlePasscode}
            type="change"
          />
        </KeyboardDismissingView>
      </KeyboardAvoidingView>
      {!faceIDAuthRes ? (
        <KeyboardDismissingView>
          <PrimaryButton
            onPress={authenticateWithFaceID}
            style={{
              marginBottom: '5%',
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
              {supportedBiometrics.indexOf(
                LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
              ) > -1
                ? t('sign.in.with.face.id')
                : t('sign.in.with.fingerprint')}
            </Text>
          </PrimaryButton>
        </KeyboardDismissingView>
      ) : (
        <></>
      )}
    </BottomSheet>
  );
});
