import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function EthTokenIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = moderateScale(32);
  const height = moderateScale(32);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M16.064 32.02c8.836 0 16-7.163 16-16 0-8.836-7.164-16-16-16-8.837 0-16 7.164-16 16 0 8.837 7.163 16 16 16z"
        fill="#403E69"
      />
      <Path
        d="M16.053 16.574l-6.721-.577 6.72-3.802v4.379zm0 4.46v6.94c-2.337-3.638-4.913-7.642-6.99-10.883a4400.6 4400.6 0 016.99 3.943zm0-10.068l-6.99 3.9 6.99-10.845v6.945z"
        fill="#fff"
      />
      <Path
        d="M22.774 15.997l-6.721.577v-4.38l6.72 3.803zm-6.721 5.038c1.98-1.12 4.537-2.564 6.988-3.944-2.076 3.242-4.652 7.246-6.988 10.882v-6.938zm0-10.07V4.022l6.988 10.845-6.988-3.9z"
        fill="#fff"
        fillOpacity={0.601}
      />
      <Path
        opacity={0.2}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.053 16.574l6.72-.577-6.72 3.775v-3.198z"
        fill="#fff"
      />
      <Path
        opacity={0.603}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.052 16.574l-6.721-.577 6.72 3.775v-3.198z"
        fill="#fff"
      />
    </Svg>
  );
}
