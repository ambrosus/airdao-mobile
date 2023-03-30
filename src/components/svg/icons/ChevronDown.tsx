import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function ChevronDownIcon(props: IconProps) {
  const { width = 13, height = 8, color = '#FFFFFF' } = props;
  return (
    <Svg width={width} height={height} fill="none">
      <Path
        d="M12.676.733a.75.75 0 01-.026 1.06L7.4 6.794a.75.75 0 01-1.035 0l-5.25-5A.75.75 0 012.148.706l4.733 4.509 4.733-4.51a.75.75 0 011.06.027z"
        fill={color}
      />
    </Svg>
  );
}
