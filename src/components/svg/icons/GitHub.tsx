import React from 'react';
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function GitHubIcon(props: IconProps) {
  const { color = '#000', scale = 1 } = props;
  const width = 16,
    height = 16;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <G clipPath="url(#prefix__clip0_1358_1231)">
        <Path
          d="M13.5 6.5V7a3.504 3.504 0 01-3.027 3.467c.342.438.527.977.527 1.533v2.5a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5v-1H4.5A2.5 2.5 0 012 11 1.5 1.5 0 00.5 9.5a.5.5 0 010-1A2.5 2.5 0 013 11a1.5 1.5 0 001.5 1.5H6V12c0-.556.185-1.095.527-1.533A3.504 3.504 0 013.5 7v-.5c.006-.621.172-1.23.48-1.77a3.736 3.736 0 01.337-2.98.5.5 0 01.433-.25 3.734 3.734 0 013 1.5h1.5a3.734 3.734 0 013-1.5.5.5 0 01.433.25 3.734 3.734 0 01.336 2.98c.31.539.475 1.149.481 1.77z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1358_1231">
          <Path fill="#fff" d="M0 0h16v16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
