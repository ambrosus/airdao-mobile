import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function OptionsIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral900 } = props;
  const width = 4,
    height = 16;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M2 3.75C1.0335 3.75 0.25 2.9665 0.25 2C0.25 1.0335 1.0335 0.25 2 0.25C2.9665 0.25 3.75 1.0335 3.75 2C3.75 2.9665 2.9665 3.75 2 3.75ZM2 9.75C1.0335 9.75 0.25 8.9665 0.25 8C0.25 7.0335 1.0335 6.25 2 6.25C2.9665 6.25 3.75 7.0335 3.75 8C3.75 8.9665 2.9665 9.75 2 9.75ZM0.249999 14C0.249999 14.9665 1.0335 15.75 2 15.75C2.9665 15.75 3.75 14.9665 3.75 14C3.75 13.0335 2.9665 12.25 2 12.25C1.0335 12.25 0.249999 13.0335 0.249999 14Z"
        fill={color}
      />
    </Svg>
  );
}
