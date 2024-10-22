import React from 'react';
import { G, Path, Svg } from 'react-native-svg';
import { IconProps } from '../../Icon.types';
import { COLORS } from '@constants/colors';

export function SendAccountActionIcon({
  scale = 1,
  color = COLORS.brand600
}: IconProps) {
  const size = 24;
  const scaled = size * scale;

  return (
    <Svg
      width={scaled}
      height={scaled}
      fill="none"
      viewBox={`0 0 ${scaled} ${scaled}`}
    >
      <G>
        <Path
          fill={color}
          d="M1.946 9.315c-.523-.174-.527-.455.01-.634l19.087-6.362c.528-.177.831.12.683.638l-5.453 19.086c-.15.528-.455.547-.679.044L12 14l6-8-8 6-8.054-2.685z"
        ></Path>
      </G>
    </Svg>
  );
}
