import { TouchableOpacity, View, StyleSheet, ViewProps } from 'react-native';
import React from 'react';
import { COLORS } from '@constants/colors';

type Props = {
  onPress: () => void;
  isActive: boolean;
  testID?: ViewProps['testID'];
};

export const RadioButton = ({ onPress, isActive, testID }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.mainContainer}
      testID={testID}
    >
      <View style={[styles.radioButtonIcon]}>
        <View
          style={[
            isActive ? styles.radioButtonActive : styles.radioButtonInactive
          ]}
          testID={isActive ? 'radio-button-active' : 'radio-button-inactive'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  radioButtonIcon: {
    backgroundColor: COLORS.sapphireBlue,
    height: 24,
    width: 24,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioButtonInactive: {
    height: 24,
    width: 24,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.lightGrey
  },
  radioButtonActive: {
    height: 0,
    width: 0,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white
  }
});
