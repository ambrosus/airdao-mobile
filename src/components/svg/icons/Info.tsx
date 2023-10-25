import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function InfoIcon(props: IconProps) {
  const { scale = 1, color = '#FF4747' } = props;
  const width = 21;
  const height = 21;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M10.002 0c5.523 0 10.001 4.478 10.001 10.002 0 5.523-4.478 10.001-10.001 10.001C4.478 20.003 0 15.525 0 10.002 0 4.478 4.478 0 10.002 0zm0 1.5a8.502 8.502 0 100 17.003 8.502 8.502 0 000-17.003zm-.004 7a.75.75 0 01.744.648l.006.102.004 5.502a.75.75 0 01-1.493.102l-.007-.101-.004-5.502a.75.75 0 01.75-.75zm.004-3.497a.999.999 0 110 1.997.999.999 0 010-1.997z"
        fill={color}
      />
    </Svg>
  );
}
