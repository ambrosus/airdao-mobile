import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export const CircleInfoIcon = ({ scale = 1, color = COLORS.neutral600 }) => {
  const width = 20 * scale;
  const height = 20 * scale;

  return (
    <Svg width={width} height={height} fill={color}>
      <Path
        fill={color}
        fillOpacity={0.4}
        d="M10 1.875A8.125 8.125 0 1 0 18.125 10 8.14 8.14 0 0 0 10 1.875ZM9.375 6.25a.625.625 0 0 1 1.25 0v4.375a.624.624 0 1 1-1.25 0V6.25ZM10 14.375a.938.938 0 1 1 0-1.875.938.938 0 0 1 0 1.875Z"
      />
    </Svg>
  );
};
