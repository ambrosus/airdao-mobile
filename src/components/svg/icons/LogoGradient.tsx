import * as React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { IconProps } from './Icon.types';

interface LogoGradientModel extends IconProps {
  logoGradient: string[];
}

export function LogoGradient(props: Omit<LogoGradientModel, 'colors'>) {
  const { scale = 1, logoGradient } = props;
  const width = 218;
  const height = 234;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      {...props}
    >
      <Path
        opacity={0.2}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M74.373 231.38a3.467 3.467 0 01-4.762.33l-5.437-4.498c-1.42-1.174-1.66-3.253-.58-4.747 9.711-13.436 16.827-27.469 21.511-41.648 17.442-52.793 1.369-108.197-41.62-143.459-11.544-9.47-25.065-17.516-40.46-23.67-1.712-.683-2.62-2.568-2.05-4.32L3.161 2.66A3.466 3.466 0 017.359.39l199.15 53.797c11.115 3.002 15.084 16.683 7.302 25.167L74.372 231.38z"
        fill="url(#prefix__paint0_linear_1301_4260)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear_1301_4260"
          x1={205.797}
          y1={25.251}
          x2={20.552}
          y2={78.993}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={logoGradient[0]} />
          <Stop offset={1} stopColor={logoGradient[1]} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
