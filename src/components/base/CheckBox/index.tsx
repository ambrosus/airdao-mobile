import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CheckBoxProps } from '@components/base/CheckBox/CheckBox.types';
import { COLORS } from '@constants/colors';

export const CheckBox = ({ isChecked, onPress }: CheckBoxProps) => {
  const iconName = isChecked ? 'checkbox-marked' : 'checkbox-blank-outline';

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <MaterialCommunityIcons
          name={iconName}
          size={30}
          borderColor={COLORS.silver}
          color={COLORS.grey}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
