import React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function ClipboardIcon(props: IconProps) {
  const { scale = 1, color = '#646464' } = props;
  const width = 20,
    height = 21;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <G clipPath="url(#prefix__clip0_917_2466)">
        <Path
          d="M3.503 3.044L3.5 5.167v10.504a3.25 3.25 0 003.25 3.25h8.616a2.251 2.251 0 01-2.122 1.5H6.75A4.75 4.75 0 012 15.671V5.167c0-.98.627-1.815 1.503-2.123zM15.75.417A2.25 2.25 0 0118 2.667v13a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-13A2.25 2.25 0 016.75.417h9zm0 1.5h-9a.75.75 0 00-.75.75v13c0 .414.336.75.75.75h9a.75.75 0 00.75-.75v-13a.75.75 0 00-.75-.75z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_917_2466">
          <Path fill={color} transform="translate(0 .417)" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
