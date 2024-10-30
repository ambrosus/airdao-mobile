import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../Icon.types';
import { COLORS } from '@constants/colors';

export function ChartIcon({ scale = 1, color = COLORS.neutral800 }: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        d="M3 12.5H7V21.5H3V12.5ZM17 8.5H21V21.5H17V8.5ZM10 2.5H14V21.5H10V2.5Z"
        fill={color}
      />
    </Svg>
  );
}
