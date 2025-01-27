import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductHarbor({
  scale = 1,
  color = COLORS.neutral0
}: IconProps) {
  const size = 47;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M0 22.421C0 11.353 7.948 2.121 18.507.001V7.28C12.562 9.054 8.078 14.159 7.273 20.4h7.14c1.02-3.784 4.54-6.574 8.723-6.574 4.184 0 7.703 2.79 8.724 6.575h7.137c-.805-6.243-5.29-11.348-11.236-13.122V0C38.321 2.12 46.27 11.352 46.27 22.421c0 12.636-10.358 22.879-23.135 22.879C10.358 45.3 0 35.057 0 22.421Zm38.925 2.513H31.86c-.827 3.06-3.285 5.468-6.408 6.278v6.859c6.903-.99 12.377-6.342 13.474-13.137Zm-18.1 13.137v-6.858c-3.125-.81-5.585-3.219-6.412-6.28H7.345c1.097 6.798 6.574 12.15 13.48 13.139Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}
