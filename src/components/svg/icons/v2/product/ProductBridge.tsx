import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductBridge({
  scale = 1,
  color = COLORS.salmonOrange
}: IconProps) {
  const size = 45;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none">
      <Path
        fill={color}
        d="m35.283 0-3.3 3.3 5.35 5.35H25.467v4.667h11.866l-5.35 5.35 3.3 3.3 10.983-10.984L35.283 0ZM11.466 21.483c5.8 0 10.5-4.7 10.5-10.5 0-5.799-4.7-10.5-10.5-10.5-5.798 0-10.5 4.701-10.5 10.5 0 5.8 4.702 10.5 10.5 10.5ZM8.934 36.65l5.35 5.35-3.3 3.3L0 34.317l10.983-10.984 3.3 3.3-5.35 5.35H20.8v4.667H8.933ZM27.8 24.983a2.333 2.333 0 0 0-2.333 2.334v14A2.333 2.333 0 0 0 27.8 43.65h14a2.334 2.334 0 0 0 2.333-2.334v-14a2.333 2.333 0 0 0-2.333-2.333h-14Z"
      />
    </Svg>
  );
}
