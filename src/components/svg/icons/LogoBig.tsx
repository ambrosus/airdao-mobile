import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function LogoBigSVG(props: IconProps) {
  const { scale = 1, color = '#646464' } = props;
  const width = 29,
    height = 36;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.465 35.745a.511.511 0 01-.69-.15l-.586-.864a.52.52 0 01.113-.7c1.931-1.51 3.519-3.214 4.767-5.038 4.648-6.792 4.648-15.34 0-22.132C3.821 5.037 2.233 3.334.302 1.823a.52.52 0 01-.113-.7L.775.26a.511.511 0 01.69-.15l26.044 15.877c1.453.886 1.453 2.997 0 3.883L1.465 35.745z"
        fill={color}
      />
    </Svg>
  );
}
