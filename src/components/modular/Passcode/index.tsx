import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';
import { View, TextInput } from 'react-native';
import { styles } from '@components/modular/Passcode/styles';

interface PasscodeProps {
  onPasscodeChange: (passcode: string[]) => void;
  autoFocus?: boolean;
  type?: 'creation' | 'change';
}

export const Passcode = forwardRef(
  ({ onPasscodeChange, autoFocus, type }: PasscodeProps, ref) => {
    const [code, setCode] = useState('');

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

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      }
    }));

    const inputRef = useRef<TextInput>(null);

    return (
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          autoFocus={autoFocus}
          contextMenuHidden={true}
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          value={code}
          onChangeText={handleCodeChange}
        />
        <View style={styles.circlesContainer}>{renderCircles()}</View>
      </View>
    );
  }
);
