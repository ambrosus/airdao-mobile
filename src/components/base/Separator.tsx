import React from 'react';
import { DimensionValue, View } from 'react-native';
import { COLORS } from '@constants/colors';

interface SeparatorProps {
  height?: DimensionValue;
  width?: DimensionValue;
  left?: number | string;
  color?: string;
}

export const Separator = (props: SeparatorProps) => {
  const { width = '100%', height = 1, color = COLORS.separator } = props;
  const separatorStyle = {
    width,
    height,
    backgroundColor: color,
    borderRadius: 1000
  };
  return <View style={separatorStyle} />;
};
