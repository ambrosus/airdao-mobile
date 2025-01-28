import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonStackParamsList, RootNavigationProp } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { Passcode } from '@components/modular';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';
import { useAppState, usePreventGoingBack } from '@hooks';
import { Cache, CacheKey } from '@lib/cache';
import { DeviceUtils, PasscodeUtils, verticalScale } from '@utils';
import { styles } from './styles';

export const PasscodeEntry = () => {
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<CommonStackParamsList, 'Passcode'>>();
  const navigation = useNavigation<RootNavigationProp>();
  const [error, setError] = useState(false);

  const { appState } = useAppState();
  const { isFaceIDEnabled } = usePasscodeStore();

  const isAvailableToNavigateBack = useRef(true);
  const isAuthSuccessfulRef = useRef(false);

  const isPreventingNavigateBack = params?.title
    ? isAvailableToNavigateBack
    : isAuthSuccessfulRef;

  usePreventGoingBack(isPreventingNavigateBack);

  const passcodeRef = useRef<TextInput>(null);
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

  const onPasscodeEntry = useCallback(() => {
    if (typeof params?.onPasscodeApproveWithNavigate === 'function') {
      params.onPasscodeApproveWithNavigate();
      closePasscodeEntry();
    }
    return null;
  }, [closePasscodeEntry, params]);

  const onSuccessActions = useCallback(() => {
    if (params?.onPasscodeApprove) {
      return params.onPasscodeApprove();
    }

    if (params?.onPasscodeApproveWithNavigate && onPasscodeEntry) {
      return onPasscodeEntry();
    }

    return closePasscodeEntry();
  }, [onPasscodeEntry, closePasscodeEntry, params]);

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
        onSuccessActions();
      } else {
        passcodeRef.current?.focus();
      }
    } catch (error) {
      // ignore
    } finally {
      await Cache.setItem(CacheKey.isBiometricAuthenticationInProgress, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        onSuccessActions();
      } else {
        setError(true);
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
        setError(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainFlex}>
      {params?.title && (
        <Header title={params.title} onBackPress={closePasscodeEntry} />
      )}
      <View style={styles.mainFlex}>
        <Text
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
          align="center"
          style={styles.passcodeText}
        >
          {t('login.enter.your.passcode')}
        </Text>
        <Spacer value={verticalScale(24)} />
        <Passcode
          error={error}
          ref={passcodeRef}
          authenticateWithBiometrics={authenticateWithBiometrics}
          onPasscodeChange={handlePasscode}
          type="change"
        />
      </View>
    </SafeAreaView>
  );
};
