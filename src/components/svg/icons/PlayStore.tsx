import React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function PlayStoreIcon(props: IconProps) {
  const { scale = 1 } = props;
  const width = 24,
    height = 25;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <G clipPath="url(#prefix__clip0_1125_10737)">
        <Path
          d="M20.983 10.834L5.25 1.832a1.5 1.5 0 00-2.054.543A1.47 1.47 0 003 3.118v18.024a1.47 1.47 0 00.743 1.282 1.5 1.5 0 001.51 0l15.73-9a1.478 1.478 0 000-2.592v.002zM13.5 13.19l1.774 1.774-8.297 4.75L13.5 13.19zM6.975 4.546l8.3 4.75L13.5 11.07 6.975 4.546zm9.648 9.646L14.56 12.13l2.063-2.063 3.603 2.063-3.603 2.062z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1125_10737">
          <Path fill="#fff" transform="translate(0 .13)" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
