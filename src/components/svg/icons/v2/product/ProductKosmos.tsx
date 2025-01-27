import React from 'react';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductKosmos({
  scale = 1,
  color = COLORS.neutral0
}: IconProps) {
  const size = 47;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none">
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M44.877 14.886c-2.654-4.562-7.666-7.638-13.412-7.638-8.519 0-15.424 6.76-15.424 15.1s6.905 15.1 15.424 15.1c6.15 0 11.46-3.524 13.936-8.622C42.655 38.334 33.727 45.3 23.136 45.3 10.358 45.3 0 35.16 0 22.65 0 10.14 10.358 0 23.136 0c9.992 0 18.504 6.201 21.741 14.886Z"
        clipRule="evenodd"
      />
      <Ellipse cx={38.726} cy={22.157} fill={color} rx={7.544} ry={7.386} />
    </Svg>
  );
}
