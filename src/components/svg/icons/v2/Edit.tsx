import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function Edit({ scale = 1, color = COLORS.neutral200 }: IconProps) {
  const width = 16;
  const height = 16;

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <Path
        fill={color}
        d="M5.702 13.33H15.5v1.667H.5v-3.536l8.25-8.25 3.535 3.536-6.583 6.583ZM9.928 2.033 11.696.266a.833.833 0 0 1 1.178 0l2.357 2.357a.833.833 0 0 1 0 1.178L13.464 5.57 9.928 2.033Z"
      />
    </Svg>
  );
}
