import Svg, { Ellipse, Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductStake({
  scale = 1,
  color = COLORS.sapphireBlue
}: IconProps) {
  const size = 47;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none">
      <Ellipse cx={23.137} cy={22.65} fill="#fff" rx={18.508} ry={18.119} />
      <Path
        stroke="#fff"
        d="M45.77 22.65c0 12.223-10.124 22.15-22.635 22.15C10.624 44.8.5 34.873.5 22.65.5 10.427 10.624.5 23.135.5 35.646.5 45.77 10.427 45.77 22.65Z"
      />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M17.08 34.03a.336.336 0 0 1-.447-.095l-.381-.55a.326.326 0 0 1 .073-.444 14.54 14.54 0 0 0 3.096-3.204c3.019-4.318 3.019-9.753 0-14.072a14.54 14.54 0 0 0-3.096-3.203.326.326 0 0 1-.073-.445l.38-.55a.336.336 0 0 1 .448-.095l16.914 10.095a1.43 1.43 0 0 1 0 2.469L17.08 34.03Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}
