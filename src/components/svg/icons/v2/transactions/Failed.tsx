import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../../Icon.types';
import { COLORS } from '@constants/colors';

export function FailedIcon({
  scale = 1,
  color = COLORS.neutral500
}: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        d="M11.9997 11.0865L16.9495 6.13672L18.3637 7.55093L13.4139 12.5007L18.3637 17.4504L16.9495 18.8646L11.9997 13.9149L7.04996 18.8646L5.63574 17.4504L10.5855 12.5007L5.63574 7.55093L7.04996 6.13672L11.9997 11.0865Z"
        fill={color}
      />
    </Svg>
  );
}
