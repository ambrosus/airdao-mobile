import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function EyeInvisibleIcon(props: IconProps) {
  const { scale = 1, color = '#FFFFFF' } = props;
  const width = 16,
    height = 16;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M.854.146a.5.5 0 10-.708.708l3.5 3.498A8.097 8.097 0 00.28 9.398a.5.5 0 00.979.204 7.09 7.09 0 013.108-4.528L5.95 6.656a3.5 3.5 0 104.884 4.884l4.313 4.314a.5.5 0 00.708-.708l-15-15zm7.27 5.857l3.363 3.363a3.5 3.5 0 00-3.363-3.363zM5.53 3.41l.803.803A6.632 6.632 0 018 4c3.206 0 6.057 2.327 6.74 5.602a.5.5 0 10.98-.204C14.943 5.673 11.693 3 8 3c-.855 0-1.687.143-2.469.41z"
        fill={color}
      />
    </Svg>
  );
}
