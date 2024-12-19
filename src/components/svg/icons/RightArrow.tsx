import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from './Icon.types';

export function RightArrowIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral0 } = props;
  const width = 15;
  const height = 14;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M10.477 5.735l-4.47-4.47L7.185.086l6.482 6.482-6.482 6.482-1.178-1.179 4.47-4.47H.333V5.735h10.144z"
        fill={color}
      />
    </Svg>
  );
}
