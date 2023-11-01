import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

export function AboutIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
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
        d={
          'M4 4.5A2.5 2.5 0 016.5 2H18a2.5 2.5 0 012.5 2.5v14.25a.75.75 0 01-.75.75H5.5a1 1 0 001 1h13.25a.75.75 0 010 1.5H6.5A2.5 2.5 0 014 19.5v-15zM12.25 8a1 1 0 100-2 1 1 0 000 2zm-.75 1.75v5a.75.75 0 001.5 0v-5a.75.75 0 00-1.5 0z'
        }
        fill={color}
      />
    </Svg>
  );
}
