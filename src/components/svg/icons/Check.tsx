import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function CheckIcon(props: IconProps) {
  const { scale = 1, color = '#000000' } = props;
  const width = 14,
    height = 10;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M13 1.5l-7.636 7L1 4.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
