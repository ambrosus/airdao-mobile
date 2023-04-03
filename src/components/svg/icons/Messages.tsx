import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function MessagesIcon(props: IconProps) {
  const { width = 17, height = 17, color = '#646464' } = props;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 8.417a8 8 0 10-16 0l.007.346.026.382a7.95 7.95 0 00.829 2.887l.063.12-.91 3.644-.014.084v.08a.5.5 0 00.62.442l3.645-.91.12.064A8 8 0 0016.5 8.416z"
        fill={color}
      />
    </Svg>
  );
}
