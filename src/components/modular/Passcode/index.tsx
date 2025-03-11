import { forwardRef, useCallback, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dropRight, split } from 'lodash';
import { Button, Spacer } from '@components/base';
import { PasscodeKeyboard } from '@components/composite/PasscodeKeyboard';
import { styles } from '@components/modular/Passcode/styles';
import { useForwardedRef } from '@hooks';
import { DeviceUtils, scale, StringUtils } from '@utils';

interface PasscodeProps {
  error?: boolean;
  onPasscodeChange: (passcode: string[]) => void;
  changePasscodeStep?: number | null;
  isBiometricEnabled?: boolean;
  authenticateWithBiometrics?: () => void | Promise<void>;
  inputBottomPadding?: number;
  type?: 'creation' | 'change';
}

type NavigationListenerType = {
  addListener: (value: string, cb: () => void) => void;
};

export const Passcode = forwardRef<TextInput, PasscodeProps>(
  (
    {
      error,
      onPasscodeChange,
      type,
      authenticateWithBiometrics = () => {
        // do nothing
      },
      inputBottomPadding = 0,
      isBiometricEnabled = true,
      changePasscodeStep = null
    }: PasscodeProps,
    ref
  ) => {
    const navigation: NavigationListenerType = useNavigation();
    const localRef = useForwardedRef<TextInput>(ref);

    const [passcode, setPasscode] = useState('');

    useEffect(() => {
      if (error) {
        setPasscode('');
      }
    }, [error]);

    useEffect(() => {
      if (DeviceUtils.isAndroid) {
        // @ ts-ignore
        const timeoutId = setTimeout(() => {
          localRef.current?.focus();
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    }, [navigation, localRef]);

    useEffect(() => {
      if (changePasscodeStep === 2 || changePasscodeStep === 3) {
        setPasscode('');
      }
    }, [changePasscodeStep, setPasscode]);

    const handleCodeChange = useCallback(
      (text: string) => {
        if (passcode.length === 4) return;
        const numericText = StringUtils.removeNonNumericCharacters(text, false);
        const newCode = `${passcode}${numericText}`;
        setPasscode(newCode);
        const passcodeArray = newCode.split('');
        onPasscodeChange(passcodeArray);
        if (type === 'change') {
          if (numericText.length === 4) {
            setTimeout(() => setPasscode(''), 50);
          }
        }
      },
      [passcode, setPasscode, onPasscodeChange, type]
    );

    const onPressBackspace = useCallback(() => {
      const newPasscode = dropRight(passcode, 1).join('');
      onPasscodeChange(split(newPasscode, ''));
      setPasscode(newPasscode);
    }, [onPasscodeChange, passcode]);

    const renderCircles = useCallback(() => {
      const circleElements = [];

      for (let i = 0; i < 4; i++) {
        const isFilled = i < passcode.length;
        circleElements.push(
          <View
            key={i}
            style={[styles.circle, isFilled && styles.circleFilled]}
          />
        );
      }

      return circleElements;
    }, [passcode.length]);

    return (
      <View>
        <Button
          activeOpacity={1}
          onPress={localRef.current?.focus}
          style={styles.circlesContainer}
        >
          {renderCircles()}
        </Button>
        <Spacer value={scale(inputBottomPadding || 50)} />
        <PasscodeKeyboard
          onBiometricPress={authenticateWithBiometrics}
          isBiometricEnabled={isBiometricEnabled}
          onRemove={onPressBackspace}
          onButtonPress={handleCodeChange}
        />
      </View>
    );
  }
);
