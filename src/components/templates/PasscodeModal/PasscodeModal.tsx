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

export const PasscodeModal = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { top, bottom } = useSafeAreaInsets();
    const { prevState } = useAppState();
    const { t } = useTranslation();
    const { isFaceIDEnabled } = usePasscode();
    const supportedBiometrics = useSupportedBiometrics();
    const passcodeRef = useRef<TextInput>(null);

    const [faceIDAuthRes, setFaceIDAuthRes] = useState<boolean>(true);
    const isAuthenticating = useRef(false);

    const handlePasscode = async (typedPasscode: string[]) => {
      if (typedPasscode.length === 4) {
        const isPasscodeCorrect = await PasscodeUtils.verifyPasscode(
          typedPasscode
        );
        if (isPasscodeCorrect) {
          localRef.current?.dismiss();
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
        localRef.current?.show();
        // delay
        setTimeout(() => {
          if (isFaceIDEnabled) authenticateWithFaceID();
          else {
            passcodeRef.current?.focus();
          }
        }, 500);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      isFaceIDEnabled,
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
                  ? t('login.with.face.id')
                  : t('login.with.fingerprint')}
              </Text>
            </PrimaryButton>
          </KeyboardDismissingView>
        ) : (
          <></>
        )}
      </BottomSheet>
    );
  }
);
