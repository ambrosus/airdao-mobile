import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function GitHubIcon(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = 14,
    height = 15;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M13.5 5.617v.5a3.504 3.504 0 01-3.027 3.467c.342.438.527.977.527 1.533v2.5a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-1H4.5a2.5 2.5 0 01-2.5-2.5 1.5 1.5 0 00-1.5-1.5.5.5 0 010-1 2.5 2.5 0 012.5 2.5 1.5 1.5 0 001.5 1.5H6v-.5c0-.556.185-1.095.527-1.533A3.504 3.504 0 013.5 6.117v-.5c.006-.621.172-1.23.48-1.77a3.736 3.736 0 01.337-2.98.5.5 0 01.433-.25 3.734 3.734 0 013 1.5h1.5a3.734 3.734 0 013-1.5.5.5 0 01.433.25 3.734 3.734 0 01.336 2.98c.31.539.475 1.148.481 1.77z"
        fill={color}
      />
    </Svg>
  );
}
