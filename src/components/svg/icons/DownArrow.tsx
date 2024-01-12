import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { RotateTransform } from 'react-native';

export function DownArrowIcon(
  props: Omit<IconProps, 'variant'> & {
    rotate?: RotateTransform['rotate'];
  }
) {
  const { color = COLORS.neutral900, scale = 1 } = props;
  const width = 14,
    height = 16;

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M13.792 9.265a.75.75 0 00-1.09-1.03l-4.955 5.239V.75a.75.75 0 00-1.5 0v12.726L1.29 8.235A.75.75 0 00.2 9.265l6.07 6.418a.995.995 0 00.566.3.753.753 0 00.329-.002.995.995 0 00.557-.298l6.07-6.418z"
        fill={color}
      />
    </Svg>
  );
}
