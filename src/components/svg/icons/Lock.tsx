import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';

export function LockIcon(props: IconProps) {
  const { scale = 1 } = props;
  const width = 20,
    height = 21;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M8 0a4 4 0 014 4v2h1.75A2.25 2.25 0 0116 8.25v9.5A2.25 2.25 0 0113.75 20H2.25A2.25 2.25 0 010 17.75v-9.5A2.25 2.25 0 012.25 6H4V4a4 4 0 014-4zm5.75 7.5H2.25a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h11.5a.75.75 0 00.75-.75v-9.5a.75.75 0 00-.75-.75zM8 11.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-10A2.5 2.5 0 005.5 4v2h5V4A2.5 2.5 0 008 1.5z"
        fill="black"
      />
    </Svg>
  );
}
