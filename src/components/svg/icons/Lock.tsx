import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function LockIcon(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = 25,
    height = 25;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M12.557 2.982a4 4 0 014 4v2h2.5a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-13a1.5 1.5 0 01-1.5-1.5v-11a1.5 1.5 0 011.5-1.5h2.5v-2a4 4 0 014-4zm0 11.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0-9.5a2 2 0 00-2 2v2h4v-2a2 2 0 00-2-2z"
        fill={color}
      />
    </Svg>
  );
}
