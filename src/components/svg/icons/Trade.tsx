import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function TradeIcon(props: IconProps) {
  const { scale = 1, color = '#FFFFFF' } = props;
  const width = 15,
    height = 14;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M9.5 1.5A1.5 1.5 0 008 0H7a1.5 1.5 0 00-1.5 1.5V14h4V1.5zm1 1.5v11H14a.5.5 0 00.5-.5V5a2 2 0 00-2-2h-2zm-8 3h2v8H1a.5.5 0 01-.5-.5V8a2 2 0 012-2z"
        fill={color}
      />
    </Svg>
  );
}
