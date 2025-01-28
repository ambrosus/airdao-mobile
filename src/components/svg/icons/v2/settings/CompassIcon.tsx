import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { SVGsModels } from '@models/SVGsModels';
import { scale as scaleFunc } from '@utils';

export const CompassIcon = ({
  scale = 1,
  color = COLORS.neutral500
}: SVGsModels) => {
  const width = scaleFunc(18) * scale;
  const height = scaleFunc(17) * scale;
  return (
    <Svg width={width} height={height} fill={color} viewBox={`0 0 18 17`}>
      <Path
        fill={color}
        d="M9 16.833A8.333 8.333 0 1 1 9 .167a8.333 8.333 0 0 1 0 16.666ZM12.75 4.75 7.334 6.833 5.25 12.25l5.417-2.083L12.75 4.75ZM9 9.333a.833.833 0 1 1 0-1.666.833.833 0 0 1 0 1.666Z"
      />
    </Svg>
  );
};
