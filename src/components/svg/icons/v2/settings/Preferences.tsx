import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils';
import { SVGsModels } from '@models/SVGsModels';

export const Preferences = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(20) * scale;
  const height = scaleFunc(21) * scale;
  return (
    <Svg width={width} height={height} fill={color} viewBox={`0 0 20 21`}>
      <Path
        fill={color}
        d="M10 12.167v6.666H3.333A6.667 6.667 0 0 1 10 12.167Zm0-.834c-2.763 0-5-2.237-5-5 0-2.762 2.237-5 5-5 2.762 0 5 2.238 5 5 0 2.763-2.238 5-5 5Zm2.162 4.843a2.926 2.926 0 0 1 0-1.352l-.827-.477.834-1.444.827.478c.327-.31.727-.545 1.17-.677v-.954h1.667v.954c.444.132.843.367 1.17.677l.828-.478.833 1.444-.826.477a2.927 2.927 0 0 1 0 1.352l.826.477-.833 1.444-.827-.478c-.328.31-.727.545-1.17.677v.954h-1.668v-.954a2.913 2.913 0 0 1-1.17-.677l-.827.478-.834-1.444.827-.477ZM15 14.666a.833.833 0 1 0 0 1.667.833.833 0 0 0 0-1.666Z"
      />
    </Svg>
  );
};
