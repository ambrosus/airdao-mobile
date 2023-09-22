import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop
} from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function LogoGradientCircular(props: IconProps) {
  const { scale = 1 } = props;
  const width = 23;
  const height = 24;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Circle
        cx={11.66}
        cy={11.683}
        r={10.712}
        fill="url(#prefix__paint0_linear_1023_10739)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.518 17.41a.164.164 0 01-.221-.048l-.189-.278a.167.167 0 01.036-.225 7.285 7.285 0 001.533-1.62c1.494-2.183 1.494-4.93 0-7.114a7.286 7.286 0 00-1.533-1.62.167.167 0 01-.036-.224l.189-.278a.164.164 0 01.221-.048l8.372 5.104a.73.73 0 010 1.248L7.518 17.41z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear_1023_10739"
          x1={22.372}
          y1={8.038}
          x2={0.948}
          y2={8.038}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={COLORS.brand600} />
          <Stop offset={1} stopColor={COLORS.brand400} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
