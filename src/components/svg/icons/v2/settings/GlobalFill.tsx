import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { SVGsModels } from '@models/SVGsModels';
import { scale as scaleFunc } from '@utils';
export const GlobalFill = ({
  scale = 1,
  color = COLORS.brand600
}: SVGsModels) => {
  const width = scaleFunc(17) * scale;
  const height = scaleFunc(18) * scale;

  return (
    <Svg width={width} height={height} fill="none">
      <Path
        fill={color}
        d="M.707 9.333h4.565a14.917 14.917 0 0 0 2.437 7.401 8.338 8.338 0 0 1-7.002-7.4Zm0-1.666A8.338 8.338 0 0 1 7.709.266a14.917 14.917 0 0 0-2.437 7.4H.707Zm16.584 0h-4.565A14.917 14.917 0 0 0 10.29.266a8.338 8.338 0 0 1 7.002 7.4Zm0 1.666a8.338 8.338 0 0 1-7.002 7.401 14.917 14.917 0 0 0 2.437-7.4h4.565Zm-10.35 0h4.116a13.257 13.257 0 0 1-2.058 6.327 13.257 13.257 0 0 1-2.058-6.327Zm0-1.666A13.257 13.257 0 0 1 9 1.34a13.257 13.257 0 0 1 2.058 6.327H6.94Z"
      />
    </Svg>
  );
};
