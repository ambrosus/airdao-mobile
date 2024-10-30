import React from 'react';
import { IconProps } from '../Icon.types';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function QRCodeIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 17V16H13V13H16V15H18V17H17V19H15V21H13V18H15V17H16ZM21 21H17V19H19V17H21V21ZM3 3H11V11H3V3ZM5 5V9H9V5H5ZM13 3H21V11H13V3ZM15 5V9H19V5H15ZM3 13H11V21H3V13ZM5 15V19H9V15H5ZM18 13H21V15H18V13ZM6 6H8V8H6V6ZM6 16H8V18H6V16ZM16 6H18V8H16V6Z"
        fill={color}
      />
    </Svg>
  );
}
