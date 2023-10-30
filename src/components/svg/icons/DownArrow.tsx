import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';
import { RotateTransform } from 'react-native';

export function DownArrowIcon(
  props: Omit<IconProps, 'variant'> & {
    rotate?: RotateTransform['rotate'];
  }
) {
  const { color = COLORS.neutral900, scale = 1 } = props;
  const width = moderateScale(24),
    height = moderateScale(24);

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M19.716 13.704a1 1 0 10-1.425-1.403L13 17.67V4a1 1 0 00-2 0v13.665L5.715 12.3a1 1 0 00-1.425 1.403l6.823 6.925a1.25 1.25 0 001.78 0l6.823-6.925z"
        fill={color}
      />
    </Svg>
  );
}
