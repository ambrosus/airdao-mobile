import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export const HistoryIcon = ({ scale = 1, color = '#0C0C0D' }: IconProps) => {
  const width = 20;
  const height = 20;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fill={color}
        d="M17.25 10A7.25 7.25 0 005.584 4.25h.666a1 1 0 010 2h-3a1 1 0 01-1-1V5h-.034l.034-.052V2.25a1 1 0 012 0v.504A9.21 9.21 0 0110 .75 9.25 9.25 0 11.818 8.87C.881 8.358 1.334 8 1.85 8c.59 0 1.017.569.949 1.156A7.25 7.25 0 1017.25 10zM11 6a1 1 0 10-2 0v5a1 1 0 001 1h3a1 1 0 100-2h-2V6z"
      ></Path>
    </Svg>
  );
};
