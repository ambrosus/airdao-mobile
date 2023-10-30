import React, { useState, forwardRef } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from '@components/modular/Passcode/styles';
import { Button } from '@components/base';
import { useForwardedRef } from '@hooks';

interface PasscodeProps {
  onPasscodeChange: (passcode: string[]) => void;
  type?: 'creation' | 'change';
}

export const Passcode = forwardRef<TextInput, PasscodeProps>(
  ({ onPasscodeChange, type }: PasscodeProps, ref) => {
    const [code, setCode] = useState('');
    const localRef = useForwardedRef<TextInput>(ref);

    const handleCodeChange = (text: string) => {
      setCode(text);
      const passcodeArray = text.split('');
      onPasscodeChange(passcodeArray);
      if (type === 'change') {
        if (text.length === 4) {
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
          autoFocus={true}
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
