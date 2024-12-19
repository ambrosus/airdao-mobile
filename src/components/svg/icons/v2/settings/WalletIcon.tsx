import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils';
import { SVGsModels } from '@models/SVGsModels';

export const WalletIcon = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(20) * scale;
  const height = scaleFunc(21) * scale;
  return (
    <Svg width={width} height={height} fill={'none'} viewBox={`0 0 20 20`}>
      <Path
        fill={color}
        d="M1.67 8h15.834c.46 0 .834.373.834.833v8.334c0 .46-.373.833-.834.833h-15a.833.833 0 0 1-.833-.833V8Zm.834-5h12.5v3.333H1.671v-2.5c0-.46.373-.833.833-.833Zm10 9.167v1.666h2.5v-1.666h-2.5Z"
      ></Path>
    </Svg>
  );
};
