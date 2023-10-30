import React from 'react';
import { Image, Defs, Path, Pattern, Svg, Use } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function BusdIcon(props: Omit<IconProps, 'color'>) {
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
      <Path fill="url(#prefix__pattern0)" d="M.473.021h32v32h-32z" />
      <Defs>
        <Pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#prefix__image0_1356_718" transform="scale(.0039)" />
        </Pattern>
        <Image
          id="prefix__image0_1356_718"
          width={256}
          height={256}
          xlinkHref={{
            uri: 'data:image/png;base64,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'
          }}
        />
      </Defs>
    </Svg>
  );
}
