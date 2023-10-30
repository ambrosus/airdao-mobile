import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function AirdaoWhiteIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = moderateScale(32);
  const height = moderateScale(32);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M9.072 4a13.856 13.856 0 0120.785 12A13.856 13.856 0 019.072 28a13.856 13.856 0 010-24z"
        fill="#fff"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.628 24.453a.235.235 0 01-.317-.07l-.27-.397a.24.24 0 01.052-.323c.89-.696 1.62-1.48 2.196-2.32 2.142-3.13 2.142-7.068 0-10.198a10.446 10.446 0 00-2.196-2.321.24.24 0 01-.052-.322l.27-.399a.235.235 0 01.317-.069l12 7.315c.67.409.67 1.38 0 1.79l-12 7.314z"
        fill="url(#prefix__paint0_linear_1363_406)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear_1363_406"
          x1={23.13}
          y1={13.439}
          x2={10}
          y2={13.439}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3568DD" />
          <Stop offset={1} stopColor="#7DA3F9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
