import React from 'react';
import { IconProps } from './Icon.types';
import { Path, Svg } from 'react-native-svg';

export const CheckmarkCircleIcon = (props: IconProps): JSX.Element => {
  const { scale = 1, color = '#2DBA8D' } = props;
  const width = 88;
  const height = 88;

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M44 7.333C64.25 7.333 80.667 23.75 80.667 44S64.25 80.667 44 80.667C23.75 80.667 7.333 64.25 7.333 44 7.333 23.75 23.75 7.333 44 7.333zm0 4.584C26.28 11.917 11.917 26.28 11.917 44c0 17.72 14.364 32.083 32.083 32.083 17.72 0 32.083-14.364 32.083-32.083 0-17.72-14.364-32.083-32.083-32.083zm15.829 20.38a2.292 2.292 0 010 3.24L39.662 55.704a2.292 2.292 0 01-3.24 0l-8.25-8.25a2.292 2.292 0 113.24-3.241l6.63 6.63 18.546-18.547a2.292 2.292 0 013.24 0z"
        fill={color}
      />
    </Svg>
  );
};
