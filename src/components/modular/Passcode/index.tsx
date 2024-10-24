import React, { forwardRef, useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@components/modular/Passcode/styles';
import { Button, Spacer } from '@components/base';
import { useForwardedRef } from '@hooks';
import { StringUtils } from '@utils/string';
import { DeviceUtils } from '@utils/device';
import { PasscodeKeyboard } from '@components/composite/PasscodeKeyboard';
import { scale } from '@utils/scaling';

interface PasscodeProps {
  onPasscodeChange: (passcode: string[]) => void;
  changePasscodeStep?: number | null;
  isBiometricEnabled?: boolean;
  authenticateWithBiometrics?: () => void | Promise<void>;
  type?: 'creation' | 'change';
}

type NavigationListenerType = {
  addListener: (value: string, cb: () => void) => void;
};

export const Passcode = forwardRef<TextInput, PasscodeProps>(
  (
    {
      onPasscodeChange,
      type,
      authenticateWithBiometrics = () => {
        // do nothing
      },
      isBiometricEnabled = true,
      changePasscodeStep = null
    }: PasscodeProps,
    ref
  ) => {
    const [code, setCode] = useState('');
    const localRef = useForwardedRef<TextInput>(ref);
    const navigation: NavigationListenerType = useNavigation();
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
        setCode('');
      }
    }, [changePasscodeStep]);

    const handleCodeChange = (text: string) => {
      if (code.length === 4) return;
      const numericText = StringUtils.removeNonNumericCharacters(text, false);
      const newCode = `${code}${numericText}`;
      setCode(newCode);
      const passcodeArray = newCode.split('');
      onPasscodeChange(passcodeArray);
      if (type === 'change') {
        if (numericText.length === 4) {
          setTimeout(() => setCode(''), 50);
        }
      }
    };

    const onPressBackspace = () => {
      const newData = code.substring(0, code.length - 1);
      setCode(newData);
    };

    const renderCircles = () => {
      const circleElements = [];

      for (let i = 0; i < 4; i++) {
        const isFilled = i < code.length;
        circleElements.push(
          <View
            key={i}
            style={[styles.circle, isFilled && styles.circleFilled]}
          />
        );
      }

      return circleElements;
    };

    return (
      <View>
        <Button
          activeOpacity={1}
          onPress={localRef.current?.focus}
          style={styles.circlesContainer}
        >
          {renderCircles()}
        </Button>
        <Spacer value={scale(50)} />
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
