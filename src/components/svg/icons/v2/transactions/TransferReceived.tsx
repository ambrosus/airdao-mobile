import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function TransferReceivedIcon({
  scale = 1,
  color = COLORS.neutral500
}: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        d="M9 14.089L17.6066 5.48242L19.0208 6.89664L10.4142 15.5032H18V17.5032H7V6.50324H9V14.089Z"
        fill={color}
      />
    </Svg>
  );
}
