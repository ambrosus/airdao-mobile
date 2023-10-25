import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

export function EditIcon(props: IconProps) {
  const { color = COLORS.neutral900, scale = 1 } = props;
  const width = moderateScale(20),
    height = moderateScale(20);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M12.92 2.873a2.975 2.975 0 014.207 4.207l-.669.669-4.207-4.207.67-.669zM11.544 4.25l-7.999 7.999a2.438 2.438 0 00-.655 1.194l-.878 3.95a.5.5 0 00.597.597l3.926-.873a2.518 2.518 0 001.234-.678l7.982-7.982-4.207-4.207z"
        fill={color}
      />
    </Svg>
  );
}
