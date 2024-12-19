import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletConnectIcon({ scale = 1 }: IconProps) {
  const width = 75;
  const height = 52;

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <Path
        fill="#3595ff"
        d="M31.5 6.5c9.424-.94 17.59 1.726 24.5 8-1.62 7.98-5.12 8.813-10.5 2.5-8.135-3.47-15.468-2.137-22 4-4.312.017-6.145-2.15-5.5-6.5 3.898-3.859 8.398-6.525 13.5-8z"
        opacity="0.922"
      ></Path>
      <Path
        fill="#3395ff"
        d="M10.5 21.5a4.932 4.932 0 013 .5 163.046 163.046 0 0011 10.5 192.717 192.717 0 0112.5-11 192.717 192.717 0 0112.5 11 192.717 192.717 0 0112.5-11c2.5 1.167 4.333 3 5.5 5.5a241.806 241.806 0 01-18 17.5 211.782 211.782 0 01-12.5-12 211.782 211.782 0 01-12.5 12A624.826 624.826 0 017 28.5c-.667-1-.667-2 0-3a19.568 19.568 0 003.5-4z"
        opacity="0.912"
      ></Path>
    </Svg>
  );
}
