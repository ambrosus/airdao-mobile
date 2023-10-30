import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

export function BellIcon(props: IconProps) {
  const { color = COLORS.neutral100, scale = 1 } = props;
  const width = moderateScale(40);
  const height = moderateScale(40);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M35.642 4.581c-5.858-5.857-15.355-5.857-21.213 0l-6 6.001-6.478 2.511a2.25 2.25 0 00-.777 3.689L23.442 39.05a2.25 2.25 0 003.689-.778l2.51-6.477 6.001-6c5.858-5.858 5.858-15.356 0-21.214zM7.358 32.866a6.002 6.002 0 01-.648-7.72l8.367 8.368a6.002 6.002 0 01-7.719-.648z"
        fill={color}
      />
    </Svg>
  );
}
