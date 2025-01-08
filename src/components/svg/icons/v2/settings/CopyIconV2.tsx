import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { SVGsModels } from '@models/SVGsModels';
import { scale as scaleFunc } from '@utils';

export const CopyIconV2 = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(12) * scale;
  const height = scaleFunc(14) * scale;
  return (
    <Svg width={width} height={height} fill={color} viewBox={`0 0 12 14`}>
      <Path
        fill={color}
        d="M2.667 3.12v-2c0-.368.298-.666.666-.666h8c.368 0 .667.298.667.667v9.333a.667.667 0 0 1-.667.667h-2v1.999c0 .369-.3.667-.671.667H.672A.668.668 0 0 1 0 13.12l.002-9.332c0-.369.3-.667.67-.667h1.995ZM1.335 4.455l-.002 8H8v-8H1.335ZM4 3.121h5.333v6.666h1.333v-8H4v1.334Z"
      />
    </Svg>
  );
};
