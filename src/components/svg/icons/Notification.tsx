import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function NotificationIcon(props: IconProps) {
  const { scale = 1, color = '#393B40' } = props;
  const width = 24,
    height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M9.042 19.003h5.916a3 3 0 01-5.916 0zm2.958-17a7.5 7.5 0 017.5 7.5v4l1.418 3.16A.95.95 0 0120.052 18h-16.1a.95.95 0 01-.867-1.338l1.415-3.16V9.49l.005-.25A7.5 7.5 0 0112 2.004z"
        fill={color}
      />
    </Svg>
  );
}
