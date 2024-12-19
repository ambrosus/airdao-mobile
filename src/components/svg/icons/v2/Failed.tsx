import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../Icon.types';

export function FailedIcon({ scale = 1 }: IconProps) {
  const width = 65;
  const height = 64;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <Path
        fill="#FF4747"
        d="M32.5 58.667c-14.727 0-26.666-11.939-26.666-26.666 0-14.728 11.94-26.667 26.667-26.667 14.727 0 26.666 11.94 26.666 26.667 0 14.727-11.939 26.666-26.666 26.666zm0-5.333c11.783 0 21.334-9.551 21.334-21.333 0-11.782-9.551-21.334-21.333-21.334-11.782 0-21.334 9.552-21.334 21.334s9.552 21.333 21.334 21.333zm-2.666-13.333h5.333v5.333h-5.333v-5.333zm0-21.334h5.333v16h-5.333v-16z"
      ></Path>
    </Svg>
  );
}
