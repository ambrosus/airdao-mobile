import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function ListIcon(props: IconProps) {
  const { scale = 1, color = COLORS.blue600 } = props;
  const width = 28;
  const height = 22;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M3.667.333a3 3 0 00-3 3v3.334a3 3 0 003 3H7a3 3 0 003-3V3.333a3 3 0 00-3-3H3.667zm-1 3a1 1 0 011-1H7a1 1 0 011 1v3.334a1 1 0 01-1 1H3.667a1 1 0 01-1-1V3.333zM13 1.667a1 1 0 100 2h13.333a1 1 0 100-2H13zm0 4a1 1 0 100 2h9.333a1 1 0 100-2H13zm-9.333 6.666a3 3 0 00-3 3v3.334a3 3 0 003 3H7a3 3 0 003-3v-3.334a3 3 0 00-3-3H3.667zm-1 3a1 1 0 011-1H7a1 1 0 011 1v3.334a1 1 0 01-1 1H3.667a1 1 0 01-1-1v-3.334zM13 13.667a1 1 0 100 2h13.333a1 1 0 000-2H13zm0 4a1 1 0 100 2h9.333a1 1 0 000-2H13z"
        fill={color}
      />
    </Svg>
  );
}
