import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { COLORS } from '@constants/colors';

type Props = {
  onPress: () => void;
  isActive: boolean;
};

export const RadioButton = ({ onPress, isActive }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
      <View style={[styles.radioButtonIcon]}>
        <View
          style={[
            isActive ? styles.radioButtonActive : styles.radioButtonInactive
          ]}
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
    backgroundColor: COLORS.grey,
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
