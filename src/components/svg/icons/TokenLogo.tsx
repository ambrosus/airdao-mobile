import React from 'react';
import { Circle, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function TokenLogo(props: IconProps) {
  const { scale = 1, color = '#F2F2F2' } = props;
  const width = 83,
    height = 84;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <Circle
        cx="41.7651"
        cy="42.0001"
        r="40.7198"
        fill={color}
        stroke="#DCDBDC"
      />
    </Svg>
  );
}
