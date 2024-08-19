import React, { useState, forwardRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@components/modular/Passcode/styles';
import { Button } from '@components/base';
import { useForwardedRef } from '@hooks';
import { StringUtils } from '@utils/string';
import { DeviceUtils } from '@utils/device';

interface PasscodeProps {
  onPasscodeChange: (passcode: string[]) => void;
  type?: 'creation' | 'change';
}

type NavigationListenerType = {
  addListener: (value: string, cb: () => void) => void;
};

export const Passcode = forwardRef<TextInput, PasscodeProps>(
  ({ onPasscodeChange, type }: PasscodeProps, ref) => {
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

    const handleCodeChange = (text: string) => {
      const numericText = StringUtils.removeNonNumericCharacters(text, false);
      setCode(numericText);
      const passcodeArray = numericText.split('');
      onPasscodeChange(passcodeArray);
      if (type === 'change') {
        if (numericText.length === 4) {
          setTimeout(() => setCode(''), 50);
        }
      }
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
        <TextInput
          ref={localRef}
          style={styles.input}
          keyboardType="numeric"
          contextMenuHidden={true}
          blurOnSubmit={false}
          autoFocus={DeviceUtils.isIOS}
          maxLength={4}
          value={code}
          onChangeText={handleCodeChange}
        />
        <Button
          activeOpacity={1}
          onPress={localRef.current?.focus}
          style={styles.circlesContainer}
        >
          {renderCircles()}
        </Button>
      </View>
    );
  }
);
