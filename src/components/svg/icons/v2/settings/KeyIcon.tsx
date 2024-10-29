import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils/scaling';
import { SVGsModels } from '@models/SVGsModels';

export const KeyIcon = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(16) * scale;
  const height = scaleFunc(15) * scale;
  return (
    <Svg width={width} height={height} fill="none" viewBox={`0 0 16 15`}>
      <Path
        fill={color}
        d="M6.094 6.638 12.711.021l1.768 1.768L13.3 2.968l1.768 1.767-2.946 2.947-1.768-1.768-2.492 2.492A4.168 4.168 0 0 1 1.22 13.28a4.167 4.167 0 0 1 4.874-6.642Zm-.749 4.874a1.667 1.667 0 1 0-2.357-2.357 1.667 1.667 0 0 0 2.357 2.357Z"
      />
    </Svg>
  );
};
