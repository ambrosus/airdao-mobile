import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function CheckmarkCircleIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 20,
    height = 20;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm3.22 6.97l-4.47 4.47-1.97-1.97a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l5-5a.75.75 0 00-1.06-1.06z"
        fill={color}
      />
    </Svg>
  );
}
