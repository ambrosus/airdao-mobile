import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';
import { View, TextInput } from 'react-native';
import { styles } from '@components/modular/Passcode/styles';
import { Button } from '@components/base';

interface PasscodeProps {
  onPasscodeChange: (passcode: string[]) => void;
  type?: 'creation' | 'change';
}

export const Passcode = forwardRef(
  ({ onPasscodeChange, type }: PasscodeProps, ref) => {
    const [code, setCode] = useState('');
    const inputRef = useRef<TextInput>(null);

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

    return (
      <View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          keyboardType="numeric"
          contextMenuHidden={true}
          maxLength={4}
          value={code}
          onChangeText={handleCodeChange}
        />
        <Button
          activeOpacity={1}
          onPress={inputRef.current?.focus}
          style={styles.circlesContainer}
        >
          {renderCircles()}
        </Button>
      </View>
    );
  }
);
