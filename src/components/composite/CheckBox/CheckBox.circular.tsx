import React from 'react';
import { View } from 'react-native';
import { CircularCheckBoxProps } from './CheckBox.types';
import { Button } from '@components/base';
import { moderateScale } from '@utils/scaling';

export const CheckBoxCircular = (props: CircularCheckBoxProps): JSX.Element => {
  const { size = 24, fillColor, value, onValueChange } = props;
  const innerCircleSize = size / 3;
  const onPress = () => {
    if (typeof onValueChange === 'function') {
      onValueChange(!value);
    }
  };

  return (
    <Button
      disabled={typeof onValueChange !== 'function'}
      type="circular"
      borderRadius={moderateScale(size / 2)}
      onPress={onPress}
      style={{
        backgroundColor: value ? fillColor : 'transparent',
        borderColor: value ? 'transparent' : fillColor,
        borderWidth: value ? 0 : 1,
        width: moderateScale(size),
        height: moderateScale(size)
      }}
    >
      <View
        style={{
          borderRadius: moderateScale(innerCircleSize / 2),
          width: moderateScale(innerCircleSize),
          height: moderateScale(innerCircleSize),
          backgroundColor: value ? '#FFFFFF' : 'transparent'
        }}
      />
    </Button>
  );
};
