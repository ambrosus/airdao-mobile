import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../Icon.types';

export function NotificationBellIcon({ scale = 1 }: IconProps) {
  const size = 21;
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
        d="M18.323 15h2v2h-20v-2h2V8a8 8 0 1116 0v7zm-11 4h6v2h-6v-2z"
      ></Path>
    </Svg>
  );
}
