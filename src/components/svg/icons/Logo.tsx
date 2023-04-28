import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function LogoSVG(props: IconProps) {
  const { scale = 1, color = '#5985EB' } = props;
  const width = 14;
  const height = 17;
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
        d="M1.503 16.898a.232.232 0 01-.312-.068l-.266-.392a.236.236 0 01.05-.317 10.285 10.285 0 002.164-2.286c2.109-3.083 2.109-6.96 0-10.043A10.286 10.286 0 00.976 1.506a.236.236 0 01-.051-.317L1.19.796A.232.232 0 011.503.73l11.818 7.203c.66.402.66 1.36 0 1.762L1.503 16.898z"
        fill={color}
      />
    </Svg>
  );
}
