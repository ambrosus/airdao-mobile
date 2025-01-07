import React from 'react';
import Svg, { Defs, Image, Path, Pattern, Use } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function TokenXENAIcon({ scale = 1 }: IconProps) {
  const size = 32 * scale;
  return (
    <Svg width={size} height={size} fill="none" viewBox="0 0 32 33">
      <Path fill="url(#pattern0_3005_40579)" d="M0 .5h32v32H0z"></Path>
      <Defs>
        <Pattern
          id="pattern0_3005_40579"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <Use xlinkHref="#image0_3005_40579" transform="scale(.02083)"></Use>
        </Pattern>
        <Image
          xlinkHref="data:image/png;base64,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"
          id="image0_3005_40579"
          width="48"
          height="48"
        ></Image>
      </Defs>
    </Svg>
  );
}
