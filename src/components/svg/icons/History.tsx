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
        d="M17 20.5H1a1 1 0 0 1-1-1v-18a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Zm-1-2v-16H2v16h14ZM5 5.5h8v2H5v-2Zm0 4h8v2H5v-2Zm0 4h5v2H5v-2Z"
      />
    </Svg>
  );
};
