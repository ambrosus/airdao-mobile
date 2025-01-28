import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function ArrowBottomFillIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const size = 24 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 16L6 10H18L12 16Z" fill={color} />
    </Svg>
  );
}
