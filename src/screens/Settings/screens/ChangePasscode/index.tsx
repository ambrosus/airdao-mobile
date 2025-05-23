import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsTabNavigationProp } from '@appTypes';
import { Button, Spacer, Text } from '@components/base';
import { Header } from '@components/composite';
import { Passcode, Toast, ToastPosition, ToastType } from '@components/modular';
import { COLORS } from '@constants/colors';
import { usePasscodeStore } from '@features/passcode';
import { usePasscodeActions } from '@features/passcode/lib/hooks';
import { verticalScale } from '@utils';
import { styles } from './styles';

export const ChangePasscode = () => {
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  const { passcode } = usePasscodeStore();
  const navigation = useNavigation<SettingsTabNavigationProp>();
  const { onChangePasscodeHandle } = usePasscodeActions();

  const [step, setStep] = useState<number>(passcode.length === 0 ? 2 : 1); // ask current passcode if already saved
  const [newPasscode, setNewPasscode] = useState<string[]>([]);
  const [buttonError, setButtonError] = useState(true);
  const [typedPasscode, setTypedPasscode] = useState<string[]>(['']);

  const [existPasswordError, setExistPasswordError] = useState(false);

  const resetPassword = () => {
    setExistPasswordError(true);
    setTypedPasscode([]);
    setNewPasscode([]);
  };

  const onStep1Press = useCallback(
    (_typedPasscode: string[]) => {
      // Step 1: Check user passcode
      if (JSON.stringify(passcode) === JSON.stringify(_typedPasscode)) {
        setStep(2);
      } else {
        Alert.alert(
          t('security.passcode.doesnt.match'),
          t('common.please.try.again'),
          [
            {
              text: t('button.try.again'),
              onPress: resetPassword,
              style: 'cancel'
            }
          ]
        );
        setExistPasswordError(false);
      }
    },
    [passcode, t]
  );

  const onStep2Press = (_typedPasscode: string[]) => {
    // Step 2: Type new user passcode

    setNewPasscode(_typedPasscode);
    setStep(3);
  };

  const onStep3Press = useCallback(
    (_typedPasscode: string[]) => {
      if (JSON.stringify(newPasscode) === JSON.stringify(_typedPasscode)) {
        onChangePasscodeHandle(_typedPasscode);
        navigation.navigate('SecuritySettings');
        Toast.show({
          text: t('change.passcode.success'),
          position: ToastPosition.Top,
          type: ToastType.Success
        });
      } else {
        Alert.alert(
          t('security.passcode.doesnt.match'),
          t('common.please.try.again'),
          [
            {
              text: t('button.try.again'),
              onPress: resetPassword,
              style: 'cancel'
            }
          ]
        );
      }
    },
    [navigation, newPasscode, onChangePasscodeHandle, t]
  );

  const handlePasscodeBtnPress = useCallback(
    async (_typedPasscode: string[]) => {
      if (_typedPasscode.length === 4) {
        switch (step) {
          case 1:
            onStep1Press(_typedPasscode);
            break;
          case 2:
            onStep2Press(_typedPasscode);
            break;
          case 3:
            onStep3Press(_typedPasscode);
            break;
          default:
            setButtonError(true);
            break;
        }
        setTypedPasscode(['']);
      }
    },
    [onStep1Press, onStep3Press, step]
  );

  const screenTitles = useMemo(() => {
    switch (step) {
      case 1:
        return {
          headerTitle: 'change.passcode.header.old',
          buttonTitle: 'button.continue'
        };
      case 2:
        return {
          headerTitle: 'change.passcode.header.new',
          buttonTitle: 'button.continue'
        };
      case 3:
        return {
          headerTitle: 'change.passcode.header.confirm',
          buttonTitle: 'button.confirm'
        };
      default:
        return {
          headerTitle: '',
          buttonTitle: ''
        };
    }
  }, [step]);

  useEffect(() => {
    if (typedPasscode.length < 4) {
      setButtonError(true);
    } else {
      setButtonError(false);
    }
  }, [typedPasscode]);

  const onProcessPasscode = async () => {
    await handlePasscodeBtnPress(typedPasscode);
  };

  return (
    <View style={{ paddingVertical: top, ...styles.main }}>
      <Header
        bottomBorder
        title={t(screenTitles.headerTitle)}
        style={styles.header}
      />
      <View style={styles.passcodeWrapper}>
        <Passcode
          error={existPasswordError}
          inputBottomPadding={110}
          changePasscodeStep={step}
          isBiometricEnabled={false}
          onPasscodeChange={setTypedPasscode}
          type="change"
        />
        <Spacer value={verticalScale(50)} />

        <Button
          disabled={buttonError}
          onPress={onProcessPasscode}
          type="circular"
          style={{
            ...styles.button,
            backgroundColor: buttonError ? COLORS.brand100 : COLORS.brand500,
            marginBottom: verticalScale(-bottom / 2)
          }}
        >
          <Text color={buttonError ? COLORS.brand300 : COLORS.neutral0}>
            {t(screenTitles.buttonTitle)}
          </Text>
        </Button>
      </View>
    </View>
  );
};
