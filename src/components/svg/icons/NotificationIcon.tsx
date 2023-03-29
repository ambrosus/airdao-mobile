import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function NotificationIcon(props: IconProps) {
  const { size = 28, color } = props;
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Path
        d="M14 3a8.501 8.501 0 018.497 8.246l.004.255v4.612l1.414 3.644c.038.098.064.201.077.305l.01.158a1.28 1.28 0 01-1.15 1.273l-.13.007-5.22.001a3.502 3.502 0 01-6.998.192l-.006-.194-5.223.001a1.28 1.28 0 01-1.235-1.62l.042-.124 1.416-3.644v-4.61A8.501 8.501 0 0114 3zm1.996 18.65L16 21.5l-4.002.002a2.001 2.001 0 003.998.15zM14 4.5a7.001 7.001 0 00-6.997 6.76l-.004.241v4.752a.75.75 0 01-.023.184l-.028.088L5.596 20H22.4l-1.348-3.474a.748.748 0 01-.045-.18L21 16.254v-4.752A7.001 7.001 0 0014 4.5z"
        fill={color}
      />
    </Svg>
  );
}
