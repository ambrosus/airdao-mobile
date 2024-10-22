import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../Icon.types';

export function PlusIcon({ scale = 1 }: IconProps) {
  const size = 20;
  const scaled = size * scale;

  return (
    <Svg
      width={scaled}
      height={scaled}
      fill="none"
      viewBox={`0 0 ${scaled} ${scaled}`}
    >
      <Path
        fill="#121212"
        d="M8.667 8.667v-8h2.667v8h8v2.667h-8v8H8.667v-8h-8V8.667h8z"
      ></Path>
    </Svg>
  );
}
