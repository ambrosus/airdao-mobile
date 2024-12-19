import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { SVGsModels } from '@models/SVGsModels';
import { scale as scaleFunc } from '@utils';

export const DownloadIcon = ({
  scale = 1,
  color = COLORS.brand500
}: SVGsModels) => {
  const width = scaleFunc(24) * scale;
  const height = scaleFunc(25) * scale;
  return (
    <Svg width={width} height={height} fill={color} viewBox={`0 0 24 25`}>
      <Path
        fill={color}
        d="M.129 23.06h24v2.667h-24V23.06Zm13.333-7.771 8.095-8.095 1.886 1.886-11.314 11.313L.815 9.08l1.886-1.886 8.095 8.095V.393h2.666V15.29Z"
      />
    </Svg>
  );
};
