import React from 'react';
import {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Svg
} from 'react-native-svg';
import { IconProps } from './Icon.types';

export function KosmosTokenIcon({ scale = 1 }: IconProps) {
  const size = 32;
  const scaled = size * scale;
  return (
    <Svg width={scaled} height={scaled} fill="none" viewBox="0 0 32 32">
      <G clipPath="url(#clip0_211_308)">
        <Rect width="32" height="32" fill="#0E0C0D" rx="16"></Rect>
        <Path fill="url(#paint0_linear_211_308)" d="M32 0H0v32h32z"></Path>
        <Path
          fill="#fff"
          fillRule="evenodd"
          d="M25.666 12.476a6.857 6.857 0 1 0 .233 6.327c-1.22 4.318-5.19 7.483-9.9 7.483-5.68 0-10.285-4.605-10.285-10.286S10.32 5.714 16 5.714c4.443 0 8.227 2.817 9.666 6.762"
          clipRule="evenodd"
        ></Path>
        <Circle cx="22.931" cy="15.776" r="3.354" fill="#fff"></Circle>
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_211_308"
          x1="16.011"
          x2="16.011"
          y1="32"
          y2="15.967"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#302C58"></Stop>
          <Stop offset="1" stopColor="#434491"></Stop>
        </LinearGradient>
        <ClipPath id="clip0_211_308">
          <Rect width="32" height="32" fill="#fff" rx="16"></Rect>
        </ClipPath>
      </Defs>
    </Svg>
  );
}
