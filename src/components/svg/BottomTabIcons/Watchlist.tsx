import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';

export function WatchlistTabIcon(props: IconProps) {
  const { scale = 1, color = '#457EFF' } = props;
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
        d="M5.988 1.5C7.608.601 9.586 0 11.949 0c4.255 0 7.258 1.947 9.182 4.075a13.45 13.45 0 012.11 3.116c.23.474.403.913.52 1.293.112.366.188.723.188 1.016 0 .522-.226 1.366-.636 2.287a12.547 12.547 0 01-2.01 3.13C19.422 17.06 16.412 19 11.948 19c-2.481 0-4.513-.6-6.151-1.5h6.151v-1H4.276A12.06 12.06 0 012.67 15h9.28v-1a4.5 4.5 0 000-9V4H2.835c.478-.52 1.022-1.03 1.632-1.5h7.481v-1H5.988zM11.949 5H2.004c-.386.51-.713 1.018-.985 1.5h7.576A4.49 4.49 0 0111.95 5zM7.917 7.5H.513c-.159.356-.284.688-.375.984-.054.176-.1.35-.133.516h7.472a4.47 4.47 0 01.44-1.5zm-.44 2.5H0c.075.422.233.941.462 1.5h7.455a4.47 4.47 0 01-.44-1.5zm1.118 2.5H.932c.255.482.565.99.934 1.5h10.083a4.49 4.49 0 01-3.354-1.5z"
        fill={color}
      />
    </Svg>
  );
}
