import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../Icon.types';
import { COLORS } from '@constants/colors';

export function CheckboxCircleFill({
  scale = 1,
  color = COLORS.brand600
}: IconProps) {
  const size = 21;
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
        d="M10.63 19.06a8.333 8.333 0 110-16.666 8.333 8.333 0 010 16.666zm-.832-5l5.893-5.892-1.179-1.179-4.714 4.714-2.357-2.357-1.178 1.179 3.535 3.535z"
      ></Path>
    </Svg>
  );
}
