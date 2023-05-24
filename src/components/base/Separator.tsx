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
  const { width = '100%', height = 1, color = COLORS.separator } = props;
  return (
    <View
      style={{ width, height, backgroundColor: color, borderRadius: 1000 }}
    />
  );
};
