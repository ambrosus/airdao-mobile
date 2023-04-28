import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function AirDAOLogo(props: IconProps) {
  const { scale = 1 } = props;
  const width = 16;
  const height = 21;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.73788 20.2758C0.61189 20.3526 0.447798 20.317 0.364975 20.1949L0.0477395 19.7272C-0.0350832 19.605 -0.00727201 19.4396 0.108935 19.3487C1.15379 18.5312 2.01265 17.6097 2.68809 16.6227C5.2031 12.9476 5.2031 8.32297 2.68809 4.64794C2.01265 3.66097 1.15379 2.73946 0.108935 1.92189C-0.00727138 1.83097 -0.0350826 1.66558 0.0477402 1.54346L0.364976 1.07572C0.447798 0.953606 0.611892 0.917997 0.737881 0.9948L14.8294 9.58493C15.6159 10.0644 15.6159 11.2063 14.8294 11.6857L0.73788 20.2758Z"
        fill="url(#paint0_linear_1374_125752)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1374_125752"
          x1="15.4193"
          y1="7.34124"
          x2="2.38847e-07"
          y2="7.34124"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3568DD" />
          <Stop offset="1" stopColor="#7DA3F9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
