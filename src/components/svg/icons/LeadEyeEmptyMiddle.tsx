import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function LeadEyeEmptyMiddleIcon({
  color = COLORS.neutral0,
  scale = 1
}: IconProps) {
  const width = 21;
  const height = 20;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <G>
        <Path
          fill={color}
          d="M3.79 11.602C4.474 8.327 7.326 6 10.531 6c3.206 0 6.058 2.327 6.741 5.602a.5.5 0 10.98-.204C17.473 7.673 14.224 5 10.531 5c-3.694 0-6.943 2.673-7.72 6.398a.5.5 0 00.978.204zM10.531 8a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm-2.5 3.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
        ></Path>
      </G>
    </Svg>
  );
}
