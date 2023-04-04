import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

interface TrendIconProps extends IconProps {
  type?: 'up' | 'down';
}

export function TrendIcon(props: TrendIconProps) {
  const { scale = 1, color = '#FFFFFF', type = 'up' } = props;
  const width = 13,
    height = 9;
  const upPath =
    'M6.496.647l5.048.002.086.015.063.021.058.029.062.042.058.054.04.05.035.058.032.078.012.043.011.087v5.021a.5.5 0 01-.991.09l-.008-.09L11 2.354 5.858 7.501a.5.5 0 01-.638.058L5.151 7.5l-1.65-1.647L.853 8.5a.5.5 0 01-.765-.638l.057-.07 3-3a.5.5 0 01.638-.057l.07.057 1.65 1.647 4.789-4.793H6.496a.5.5 0 01-.492-.41l-.008-.09a.5.5 0 01.5-.5z';
  const downPath =
    'M6.496 8.765l5.048-.002.086-.015.063-.021.058-.029.062-.042.058-.054.04-.05.035-.058.032-.078.012-.043.011-.087V3.265a.5.5 0 00-.991-.09l-.008.09L11 7.058 5.858 1.91a.5.5 0 00-.638-.058l-.069.058-1.65 1.647L.853.911a.5.5 0 00-.765.638l.057.07 3 3a.5.5 0 00.638.057l.07-.057 1.65-1.647 4.789 4.793H6.496a.5.5 0 00-.492.41l-.008.09a.5.5 0 00.5.5z';
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path d={type == 'up' ? upPath : downPath} fill={color} />
    </Svg>
  );
}
