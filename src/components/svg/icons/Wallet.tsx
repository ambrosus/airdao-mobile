import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function WalletIcon(props: IconProps) {
  const { color = COLORS.brand500, scale = 1 } = props;
  const width = 24,
    height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M0 2.833v14.875A3.792 3.792 0 003.792 21.5h14a3.792 3.792 0 003.791-3.792V7.792a3.793 3.793 0 00-2.916-3.69v-.977A2.625 2.625 0 0016.042.5H2.625A2.625 2.625 0 00.016 2.833H0zM2.625 4a.875.875 0 110-1.75h13.417c.483 0 .875.392.875.875V4H2.625zm12.833 8.167h2.334a.875.875 0 110 1.75h-2.334a.875.875 0 010-1.75z"
        fill={color}
      />
    </Svg>
  );
}
