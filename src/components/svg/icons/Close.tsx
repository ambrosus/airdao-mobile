import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

export function CloseIcon(props: IconProps) {
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
        d="M4.21 4.387l.083-.094a1 1 0 011.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 111.414 1.414L13.415 12l6.292 6.293a1 1 0 01.083 1.32l-.083.094a1 1 0 01-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 01-1.414-1.414L10.585 12 4.293 5.707a1 1 0 01-.083-1.32l.083-.094-.083.094z"
        fill={color}
      />
    </Svg>
  );
}
