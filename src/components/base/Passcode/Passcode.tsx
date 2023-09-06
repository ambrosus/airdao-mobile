import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const Passcode = ({
  onPasscodeChange
}: {
  onPasscodeChange: (passcode: string[]) => void;
}) => {
  const [code, setCode] = useState('');

  const handleCodeChange = (text: string) => {
    if (/^\d{0,4}$/.test(text)) {
      setCode(text);
      const passcodeArray = text.split('');
      onPasscodeChange(passcodeArray);
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
    borderColor: 'black',
    width: 200,
    height: 30,
    opacity: 0,
    position: 'absolute'
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
    borderColor: COLORS.nero,
    marginHorizontal: scale(18)
  },
  circleFilled: {
    backgroundColor: 'black'
  }
});
