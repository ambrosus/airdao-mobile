import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function WalletsActiveIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const width = 25;
  const height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      fill="none"
    >
      <Path
        d="M2.75488 9H21.7549C22.3072 9 22.7549 9.44771 22.7549 10V20C22.7549 20.5523 22.3072 21 21.7549 21H3.75488C3.2026 21 2.75488 20.5523 2.75488 20V9ZM3.75488 3H18.7549V7H2.75488V4C2.75488 3.44771 3.2026 3 3.75488 3ZM15.7549 14V16H18.7549V14H15.7549Z"
        fill={color}
      />
    </Svg>
  );
}
