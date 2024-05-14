import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function WatchlistTabIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 30;
  const height = 28;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M7.127 2C9.058.812 11.487 0 14.5 0c5.369 0 8.886 2.58 11.032 5.268a16.53 16.53 0 012.263 3.797c.234.55.404 1.039.517 1.433.103.354.188.728.188 1.002s-.085.648-.188 1.002c-.113.394-.283.883-.517 1.433a16.531 16.531 0 01-2.263 3.797C23.386 20.42 19.869 23 14.5 23c-3.012 0-5.442-.812-7.373-2H14.5v-1.5H5.129a14.902 14.902 0 01-1.842-2H14.5v-1a5 5 0 000-10v-1H3.287l.181-.232A14.906 14.906 0 015.128 3.5H14.5V2H7.127zm5.19 5H2.264c-.43.713-.77 1.395-1.03 2h8.936a5.022 5.022 0 012.149-2zM9.6 10.5H.687c-.102.354-.187.727-.187 1s.085.646.187 1H9.6a5.022 5.022 0 010-2zm.569 3.5H1.233c.26.605.6 1.287 1.03 2h10.055a5.022 5.022 0 01-2.15-2z"
        fill={color}
      />
    </Svg>
  );
}
