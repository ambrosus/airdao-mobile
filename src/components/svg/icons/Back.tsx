import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function BackIcon(props: IconProps) {
  const { scale = 1, color = COLORS.black } = props;
  const width = 24,
    height = 24;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M15.707 4.293a1 1 0 010 1.414L9.414 12l6.293 6.293a1 1 0 01-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z"
        fill={color}
      />
    </Svg>
  );
}
