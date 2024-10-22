import React from 'react';
import { IconProps } from '../../Icon.types';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function StakeAccountActionIcon({
  scale = 1,
  color = COLORS.brand600
}: IconProps) {
  const size = 20;
  const scaled = size * scale;

  return (
    <Svg
      width={scaled}
      height={scaled}
      fill="none"
      viewBox={`0 0 ${scaled} ${scaled}`}
    >
      <Path
        fill={color}
        d="M10.005 20.002c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm-2.5-13l-2.5 2.5 5 5 5-5-2.5-2.5h-5z"
      ></Path>
    </Svg>
  );
}
