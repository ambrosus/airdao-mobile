import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils';
import { SVGsModels } from '@models/SVGsModels';

export const NotificationIcon = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(20) * scale;
  const height = scaleFunc(21) * scale;
  return (
    <Svg width={width} height={height} fill="none" viewBox={`0 0 20 21`}>
      <Path
        fill={color}
        d="M16.667 14.667h1.667v1.666H1.667v-1.666h1.667V8.833a6.667 6.667 0 1 1 13.333 0v5.834ZM7.5 18h5v1.667h-5V18Z"
      />
    </Svg>
  );
};
