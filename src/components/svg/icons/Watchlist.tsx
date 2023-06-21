import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WatchlistIcon(props: IconProps) {
  const { scale = 1, color = '#FF7A00' } = props;
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.025 6.602C1.708 3.327 4.56 1 7.765 1c3.206 0 6.058 2.327 6.742 5.602a.5.5 0 00.979-.204C14.707 2.673 11.459 0 7.766 0 4.072 0 .823 2.673.046 6.398a.5.5 0 00.979.204zM7.755 3a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"
        fill={color}
      />
    </Svg>
  );
}
