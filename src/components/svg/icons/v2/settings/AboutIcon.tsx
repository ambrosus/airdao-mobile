import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils/scaling';
import { SVGsModels } from '@models/SVGsModels';

export const AboutIcon = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(20) * scale;
  const height = scaleFunc(21) * scale;
  return (
    <Svg width={width} height={height} fill={color} viewBox={`0 0 20 21`}>
      <Path
        fill="#3568DD"
        d="M10 18.833a8.333 8.333 0 1 1 0-16.666 8.333 8.333 0 0 1 0 16.666Zm0-10.416a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM11.667 13h-.833V9.25h-2.5v1.667h.833V13h-.833v1.667h3.333V13Z"
      />
    </Svg>
  );
};
