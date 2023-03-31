import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function TwitterIcon(props: IconProps) {
  const { width = 20, height = 17, color = '#646464' } = props;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.29 16.543c7.547 0 11.675-6.253 11.675-11.676 0-.177 0-.354-.012-.53A8.348 8.348 0 0020 2.213a8.179 8.179 0 01-2.357.646 4.117 4.117 0 001.804-2.27 8.222 8.222 0 01-2.605.996 4.107 4.107 0 00-6.993 3.742A11.65 11.65 0 011.392 1.04a4.106 4.106 0 001.27 5.478A4.067 4.067 0 01.8 6.004v.052a4.105 4.105 0 003.292 4.023 4.098 4.098 0 01-1.853.07A4.109 4.109 0 006.073 13 8.234 8.234 0 010 14.699a11.619 11.619 0 006.29 1.84"
        fill={color}
      />
    </Svg>
  );
}
