import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ContractCallIcon({
  scale = 1,
  color = COLORS.neutral500
}: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        d="M20 22.5H4C3.44772 22.5 3 22.0523 3 21.5V3.5C3 2.94772 3.44772 2.5 4 2.5H20C20.5523 2.5 21 2.94772 21 3.5V21.5C21 22.0523 20.5523 22.5 20 22.5ZM19 20.5V4.5H5V20.5H19ZM7 6.5H11V10.5H7V6.5ZM7 12.5H17V14.5H7V12.5ZM7 16.5H17V18.5H7V16.5ZM13 7.5H17V9.5H13V7.5Z"
        fill={color}
      />
    </Svg>
  );
}
