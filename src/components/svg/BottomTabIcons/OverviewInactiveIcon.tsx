import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';

export function OverviewInactiveIcon(props: IconProps) {
  const { scale = 1, color = '#C2C5CC' } = props;
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M2.25 0a2.25 2.25 0 012.248 2.25v13.5a2.25 2.25 0 11-4.498 0V2.25A2.25 2.25 0 012.25 0zm6.5 4a2.25 2.25 0 012.248 2.25v9.5a2.25 2.25 0 11-4.498 0v-9.5A2.25 2.25 0 018.75 4zm6.5 4a2.25 2.25 0 012.248 2.25v5.5a2.25 2.25 0 11-4.498 0v-5.5A2.25 2.25 0 0115.25 8z"
        fill={color}
      />
    </Svg>
  );
}
