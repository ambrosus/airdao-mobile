import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function WalletTabIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M3.5 5.833v14.875A3.792 3.792 0 007.292 24.5h14a3.792 3.792 0 003.791-3.792v-9.916a3.793 3.793 0 00-2.916-3.69v-.977A2.625 2.625 0 0019.542 3.5H6.125a2.625 2.625 0 00-2.609 2.333H3.5zM6.125 7a.875.875 0 110-1.75h13.417c.483 0 .875.392.875.875V7H6.125zm12.833 8.167h2.334a.875.875 0 110 1.75h-2.334a.875.875 0 010-1.75z"
        fill={color}
      />
    </Svg>
  );
}
