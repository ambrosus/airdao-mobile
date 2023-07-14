import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function LogoSVG(props: IconProps) {
  const { scale = 1 } = props;
  return (
    <Svg
      width="53"
      height="65"
      viewBox="0 0 53 65"
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.32131 64.2551C2.90232 64.5106 2.35662 64.3921 2.08119 63.986L1.02619 62.4305C0.75076 62.0244 0.843248 61.4744 1.2297 61.172C4.70446 58.4531 7.56066 55.3886 9.8069 52.1063C18.1708 39.8847 18.1708 24.505 9.8069 12.2834C7.56066 9.00109 4.70446 5.93654 1.22971 3.21766C0.84325 2.91527 0.750762 2.36526 1.0262 1.95916L2.08119 0.403648C2.35662 -0.00245952 2.90233 -0.120879 3.32131 0.134534L50.1839 28.7017C52.7993 30.2961 52.7993 34.0936 50.1839 35.688L3.32131 64.2551Z"
        fill="url(#paint0_linear_2919_37233)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_2919_37233"
          x1="58.1305"
          y1="32.7652"
          x2="-17.9909"
          y2="32.7652"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" />
          <Stop offset="1" stopColor="white" stopOpacity="0.6" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
