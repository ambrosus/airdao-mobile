import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function EyeVisibleIcon(props: IconProps) {
  const { scale = 1, color = '#FFFFFF' } = props;
  const width = 16,
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
        d="M1.26 6.602C1.942 3.327 4.793 1 8 1c3.206 0 6.057 2.327 6.74 5.602a.5.5 0 00.98-.204C14.943 2.673 11.693 0 8 0 4.307 0 1.057 2.673.28 6.398a.5.5 0 00.98.204zM7.99 3a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"
        fill={color}
      />
    </Svg>
  );
}
