import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function StarFilledIcon(props: IconProps) {
  const { scale = 1, color = COLORS.deepBlue } = props;
  const width = 20,
    height = 20;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M8.788 1.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.719.901 5.251c.19 1.103-.968 1.944-1.959 1.423l-4.716-2.479-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.251L.41 8.949c-.801-.781-.359-2.142.748-2.303L6.43 5.88l2.358-4.777z"
        fill={color}
      />
    </Svg>
  );
}
