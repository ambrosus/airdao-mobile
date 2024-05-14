import * as React from 'react';
import Svg, { Defs, Image, Path, Pattern, Use } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export const BSCIcon = (props: IconProps) => {
  const { scale = 1 } = props;
  const width = 31;
  const height = 31;

  return (
    <Svg width={width * scale} height={height * scale} fill="none" {...props}>
      <Path fill="url(#a)" d="M.057.982h20v20h-20z" />
      <Defs>
        <Pattern
          id="a"
          width={1}
          height={1}
          patternContentUnits="objectBoundingBox"
        >
          <Use xlinkHref="#b" transform="scale(.0052)" />
        </Pattern>
        <Image
          xlinkHref="data:image/png;base64,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"
          id="b"
          width={192}
          height={192}
        />
      </Defs>
    </Svg>
  );
};
