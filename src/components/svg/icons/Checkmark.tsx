import React from 'react';
import { View } from 'react-native';
import { CheckIcon } from './Check';

interface CheckmarkProps {
  fillColor?: string;
  size: number;
  iconScale?: number;
  iconColor?: string;
}

export const Checkmark = (props: CheckmarkProps): JSX.Element => {
  const { fillColor = 'transparent', size, iconColor } = props;

  return (
    <View
      style={{
        backgroundColor: fillColor,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CheckIcon color={iconColor} />
    </View>
  );
};
