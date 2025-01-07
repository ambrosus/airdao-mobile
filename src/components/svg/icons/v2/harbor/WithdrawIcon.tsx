import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export const WithdrawIcon = ({ scale = 1, color = COLORS.neutral600 }) => {
  const width = 20 * scale;
  const height = 20 * scale;

  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fill={color}
        d="M14 7.5h-3.375v5.208a.63.63 0 0 1-.625.625.63.63 0 0 1-.625-.625V7.5H6c-2.667 0-4.333 1.667-4.333 4.333v2.159c0 2.675 1.666 4.341 4.333 4.341h7.992c2.666 0 4.333-1.666 4.333-4.333v-2.167C18.333 9.167 16.667 7.5 14 7.5ZM10.625 3.8l1.725 1.725a.618.618 0 0 0 .442.183.618.618 0 0 0 .441-.183.629.629 0 0 0 0-.883L10.442 1.85a.629.629 0 0 0-.884 0L6.767 4.642a.629.629 0 0 0 0 .883.629.629 0 0 0 .883 0L9.375 3.8v3.7h1.25V3.8Z"
      />
    </Svg>
  );
};
