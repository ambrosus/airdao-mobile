import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function BackIcon(props: IconProps) {
  const { size = 24, color = '#000000' } = props;
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Path
        d="M15.707 4.293a1 1 0 010 1.414L9.414 12l6.293 6.293a1 1 0 01-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z"
        fill={color}
      />
    </Svg>
  );
}
