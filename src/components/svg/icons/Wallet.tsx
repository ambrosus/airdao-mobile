import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function WalletIcon(props: IconProps) {
  const { color = COLORS.brand500, scale = 1 } = props;

  return (
    <Svg width={24 * scale} height={24 * scale} fill="none" {...props}>
      <Path
        fill={color}
        d="M6.083 4.149a1.75 1.75 0 0 0-1.75 1.75v11.667a2.917 2.917 0 0 0 2.917 2.916h11.083a2.333 2.333 0 0 0 2.333-2.333V8.816c0-.864-.469-1.618-1.166-2.022v-.312a2.333 2.333 0 0 0-2.334-2.333H6.083Zm12.25 2.333H6.083a.583.583 0 1 1 0-1.166h11.083c.645 0 1.167.522 1.167 1.166Zm-1.75 7h1.167a.583.583 0 1 1 0 1.167h-1.167a.583.583 0 1 1 0-1.167Z"
      />
    </Svg>
  );
}
