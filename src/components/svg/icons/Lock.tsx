import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

export function LockIcon(props: IconProps) {
  const { color = COLORS.brand500, scale = 1 } = props;
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
        d="M12 2a4 4 0 014 4v2h2.5A1.5 1.5 0 0120 9.5v11a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 20.5v-11A1.5 1.5 0 015.5 8H8V6a4 4 0 014-4zm0 11.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 4a2 2 0 00-2 2v2h4V6a2 2 0 00-2-2z"
        fill={color}
      />
    </Svg>
  );
}
