import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function AirdaoBlueIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M8.895 2.854a15.242 15.242 0 0122.863 13.2 15.242 15.242 0 01-22.863 13.2 15.242 15.242 0 010-26.4z"
        fill="#3668DD"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7 24.703a.236.236 0 01-.318-.069l-.27-.398a.24.24 0 01.052-.322 10.45 10.45 0 002.197-2.322c2.142-3.13 2.142-7.07 0-10.2a10.449 10.449 0 00-2.197-2.322.24.24 0 01-.052-.323l.27-.398a.236.236 0 01.318-.07l12.003 7.318c.67.408.67 1.381 0 1.79L11.7 24.702z"
        fill="#fff"
      />
    </Svg>
  );
}
