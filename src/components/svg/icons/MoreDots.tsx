import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function MoreDotsIcon({ scale = 1, color = '#A1A6B2' }: IconProps) {
  const width = 16;
  const height = 4;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox="0 0 16 4"
    >
      <Circle cx="8" cy="2" r="2" fill={color}></Circle>
      <Circle cx="2" cy="2" r="2" fill={color}></Circle>
      <Circle cx="14" cy="2" r="2" fill={color}></Circle>
    </Svg>
  );
}
