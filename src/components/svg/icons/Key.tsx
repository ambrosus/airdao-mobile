import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function KeyIcon({ color = COLORS.neutral400, scale = 1 }: IconProps) {
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <G>
        <Path
          fill={color}
          d="M9 9.417C9 5.827 11.828 3 15.417 3s6.417 2.828 6.417 6.417c0 3.588-2.828 6.416-6.417 6.416a6.72 6.72 0 01-1.75-.21v.21c0 .645-.522 1.167-1.167 1.167h-1.166v1.167c0 .644-.523 1.166-1.167 1.166H9v.584a1.75 1.75 0 01-1.75 1.75H4.917a1.75 1.75 0 01-1.75-1.75v-1.85c0-.465.184-.91.513-1.238l5.297-5.298c.156-.155.233-.429.165-.744A6.555 6.555 0 019 9.417zm9.334-1.75a1.167 1.167 0 10-2.334 0 1.167 1.167 0 002.334 0z"
        ></Path>
      </G>
    </Svg>
  );
}
