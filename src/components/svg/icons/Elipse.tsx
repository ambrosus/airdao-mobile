import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Circle, Svg } from 'react-native-svg';

export function ElipseIcon(props: IconProps) {
  const { scale = 1, color = '#D9D9D9' } = props;
  const width = 193;
  const height = 192;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <Circle cx="96.5" cy="96" r="96" fill={color} />
    </Svg>
  );
}
