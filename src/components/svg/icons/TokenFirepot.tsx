import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function FirepotIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M16 32c8.867 0 16-7.133 16-16S24.867 0 16 0 0 7.133 0 16s7.133 16 16 16z"
        fill="#E3ECFF"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.099 26.622a.277.277 0 01-.387-.089l-.33-.515a.322.322 0 01.064-.417 13.221 13.221 0 002.677-3.004c2.61-4.05 2.61-9.145 0-13.194A13.217 13.217 0 009.446 6.4a.322.322 0 01-.063-.417l.33-.515a.277.277 0 01.386-.089l14.622 9.465c.816.528.816 1.786 0 2.314L10.1 26.622z"
        fill="url(#prefix__paint0_linear_1400_491)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear_1400_491"
          x1={27.201}
          y1={16.189}
          x2={3.449}
          y2={16.189}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3568DD" />
          <Stop offset={1} stopColor="#3568DD" stopOpacity={0.66} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
