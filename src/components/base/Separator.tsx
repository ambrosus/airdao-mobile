import { COLORS } from '@constants/colors';
import React from 'react';
import { View } from 'react-native';

interface SeparatorProps {
  height?: number | string;
  width?: number | string;
  left?: number | string;
  color?: string;
}

export const Separator = (props: SeparatorProps) => {
  const {
    width = '90%',
    height = 1,
    color = COLORS.separator,
    left = 16
  } = props;
  return <View style={{ width, height, backgroundColor: color, left }} />;
};
