import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const Passcode = ({
  onPasscodeChange,
  autoFocus,
  type
}: {
  onPasscodeChange: (passcode: string[]) => void;
  autoFocus?: boolean;
  type?: 'creation' | 'change';
}) => {
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

  return (
    <View style={styles.container}>
      <TextInput
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: COLORS.neutral800,
    width: scale(220),
    height: verticalScale(60),
    opacity: 0,
    position: 'absolute',
    zIndex: 10
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.neutral800,
    marginHorizontal: scale(18)
  },
  circleFilled: {
    backgroundColor: COLORS.neutral800
  }
});
