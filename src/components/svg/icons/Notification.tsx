import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function NotificationIcon(props: IconProps) {
  const { scale = 1, color = '#393B40' } = props;

  return (
    <Svg width={25 * scale} height={25 * scale} fill="none" {...props}>
      <Path
        fill={color}
        d="M9.542 19.985h5.916a3 3 0 0 1-5.916 0ZM12.5 2.986a7.5 7.5 0 0 1 7.5 7.5v3.999l1.418 3.16a.95.95 0 0 1-.866 1.339h-16.1a.95.95 0 0 1-.867-1.338L5 14.486v-4.013l.005-.25A7.5 7.5 0 0 1 12.5 2.986Z"
      />
    </Svg>
  );
}
