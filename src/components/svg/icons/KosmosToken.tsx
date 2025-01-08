import React from 'react';
import { IconProps } from './Icon.types';
import {
  Circle,
  ClipPath,
  Defs,
  G,
  Image,
  Pattern,
  Rect,
  Svg,
  Use
} from 'react-native-svg';

export function KosmosTokenIcon({ scale = 1 }: IconProps) {
  const size = 48;
  const scaled = size * scale;
  return (
    <Svg
      width={scaled}
      height={scaled}
      viewBox={`0 0 ${scaled} ${scaled}`}
      fill="none"
    >
      <G clipPath="url(#clip0_1735_29591)">
        <Circle cx="24" cy="24.5" r="32" fill="#302C58" />
        <Rect
          x="5"
          y="5"
          width={scaled}
          height={scaled}
          fill="url(#pattern0_1735_29591)"
        />
      </G>
      <Defs>
        <Pattern
          id="pattern0_1735_29591"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Use xlinkHref="#image0_1735_29591" transform="scale(0.00909091)" />
        </Pattern>
        <ClipPath id="clip0_1735_29591">
          <Rect y="0.5" width={scaled} height={scaled} rx="24" fill="white" />
        </ClipPath>
        <Image
          id="image0_1735_29591"
          width="110"
          height="110"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}
