import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../../Icon.types';
import { COLORS } from '@constants/colors';

export function TransferSentIcon({
  scale = 1,
  color = COLORS.neutral500
}: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        d="M16.0032 9.91421L7.39663 18.5208L5.98242 17.1066L14.589 8.5H7.00324V6.5H18.0032V17.5H16.0032V9.91421Z"
        fill={color}
      />
    </Svg>
  );
}
