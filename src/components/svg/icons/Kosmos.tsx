import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function KosmosIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral600 } = props;
  const width = 14;
  const height = 14;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <Path
        fill={color}
        d="M9 2.29A1.5 1.5 0 007.5.79h-1A1.5 1.5 0 005 2.29v12.5h4V2.29zm1 1.5v11h3.5a.5.5 0 00.5-.5v-8.5a2 2 0 00-2-2h-2zm-8 3h2v8H.5a.5.5 0 01-.5-.5v-5.5a2 2 0 012-2z"
      ></Path>
    </Svg>
  );
}
