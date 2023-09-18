import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function WalletTabIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M5.583 3.833a1.75 1.75 0 00-1.75 1.75V17.25a2.917 2.917 0 002.917 2.917h11.084a2.333 2.333 0 002.333-2.334V8.5c0-.864-.47-1.618-1.167-2.021v-.312a2.333 2.333 0 00-2.333-2.334H5.583zm12.25 2.334H5.584a.583.583 0 110-1.167h11.084c.644 0 1.166.522 1.166 1.167zm-1.75 7h1.167a.583.583 0 010 1.166h-1.166a.583.583 0 110-1.166z"
        fill={color}
      />
    </Svg>
  );
}
