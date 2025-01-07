import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from './Icon.types';

export function PlusIcon(props: IconProps) {
  const { scale = 1, color = COLORS.gray500 } = props;
  const width = 18,
    height = 18;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75.417a.75.75 0 01.743.648l.007.102.001 7.25h7.253a.75.75 0 01.102 1.493l-.102.007H9.501l.002 7.25a.75.75 0 01-1.493.101l-.007-.102-.002-7.249H.752A.75.75 0 01.65 8.424l.102-.007h7.25L8 1.167a.75.75 0 01.75-.75z"
        fill={color}
      />
    </Svg>
  );
}
