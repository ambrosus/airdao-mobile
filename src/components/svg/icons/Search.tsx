import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function SearchIcon(props: IconProps) {
  const { scale = 1, color = COLORS.black } = props;
  const width = 16,
    height = 15;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M6.265.625a5.5 5.5 0 014.384 8.823l4.147 4.147a.75.75 0 01-.977 1.133l-.084-.073-4.147-4.147A5.5 5.5 0 116.265.625zm0 1.5a4 4 0 100 8 4 4 0 000-8z"
        fill={color}
      />
    </Svg>
  );
}
