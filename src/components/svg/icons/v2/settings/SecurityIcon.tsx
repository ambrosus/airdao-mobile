import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { SVGsModels } from '@models/SVGsModels';
import { scale as scaleFunc } from '@utils';

export const SecurityIcon = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(20) * scale;
  const height = scaleFunc(21) * scale;
  return (
    <Svg width={width} height={height} fill={color} viewBox={`0 0 20 21`}>
      <Path
        fill={color}
        d="M15 7.167h1.667c.46 0 .833.373.833.833v10c0 .46-.373.833-.833.833H3.333A.833.833 0 0 1 2.5 18V8c0-.46.373-.833.833-.833H5v-.834a5 5 0 1 1 10 0v.834ZM9.167 13.61v1.89h1.666v-1.89a1.666 1.666 0 1 0-1.666 0Zm4.166-6.443v-.834a3.333 3.333 0 0 0-6.666 0v.834h6.666Z"
      />
    </Svg>
  );
};
