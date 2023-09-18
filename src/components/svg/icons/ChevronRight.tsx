import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function ChevronRightIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral0 } = props;
  const width = 8,
    height = 13;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M.733.842a.75.75 0 011.06.026l5.001 5.25a.75.75 0 010 1.035l-5 5.25A.75.75 0 01.706 11.37l4.509-4.733-4.51-4.733A.75.75 0 01.734.843z"
        fill={color}
      />
    </Svg>
  );
}
