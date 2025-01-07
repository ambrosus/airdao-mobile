import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from './Icon.types';

export function ScannerQRIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral700 } = props;
  const width = 20,
    height = 20;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M6 4H4v2h2V4zm-5-.5A2.5 2.5 0 013.5 1h3A2.5 2.5 0 019 3.5v3A2.5 2.5 0 016.5 9h-3A2.5 2.5 0 011 6.5v-3zM3.5 3a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM4 14h2v2H4v-2zm-3-.5A2.5 2.5 0 013.5 11h3A2.5 2.5 0 019 13.5v3A2.5 2.5 0 016.5 19h-3A2.5 2.5 0 011 16.5v-3zm2.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM16 4h-2v2h2V4zm-2.5-3A2.5 2.5 0 0011 3.5v3A2.5 2.5 0 0013.5 9h3A2.5 2.5 0 0019 6.5v-3A2.5 2.5 0 0016.5 1h-3zM13 3.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-3zM11 11h2.75v2.75H11V11zm5.25 2.75h-2.5v2.5H11V19h2.75v-2.75h2.5V19H19v-2.75h-2.75v-2.5zm0 0V11H19v2.75h-2.75z"
        fill={color}
      />
    </Svg>
  );
}
