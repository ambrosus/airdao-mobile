import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function RightArrowIcon(props: IconProps) {
  const { size = 14, color = '#FFFFFF' } = props;
  return (
    <Svg
      width={size * 1.1}
      height={size}
      fill="none"
      viewBox={`0 0 ${size * 1.1} ${size}`}
    >
      <Path
        d="M10.477 5.735l-4.47-4.47L7.185.086l6.482 6.482-6.482 6.482-1.178-1.179 4.47-4.47H.333V5.735h10.144z"
        fill={color}
      />
    </Svg>
  );
}
