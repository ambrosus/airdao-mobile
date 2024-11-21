import React from 'react';
import { IconProps } from '../Icon.types';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function Key({ scale = 1, color = COLORS.neutral200 }: IconProps) {
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
        d="M6.594 7.138 13.211.521l1.768 1.768L13.8 3.468l1.768 1.768-2.946 2.946-1.768-1.768-2.492 2.492A4.168 4.168 0 0 1 1.72 13.78a4.167 4.167 0 0 1 4.874-6.642Zm-.749 4.874a1.667 1.667 0 1 0-2.357-2.357 1.667 1.667 0 0 0 2.357 2.357Z"
      />
    </Svg>
  );
}
