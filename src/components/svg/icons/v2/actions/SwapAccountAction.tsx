import { G, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function SwapAccountActionIcon({
  scale = 1,
  color = COLORS.brand600
}: IconProps) {
  const size = 24;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none" viewBox="0 0 24 24">
      <G>
        <Path
          fill={color}
          d="M21.5 9a6.502 6.502 0 01-4 6.002V15A8.5 8.5 0 009 6.5h-.002A6.502 6.502 0 0121.5 9zM7 3a4 4 0 00-4 4v1.5h2V7a2 2 0 012-2h1.5V3H7zm12 12.5V17a2 2 0 01-2 2h-1.5v2H17a4 4 0 004-4v-1.5h-2zm-10 6a6.5 6.5 0 100-13 6.5 6.5 0 000 13zm0-9l2.5 2.5L9 17.5 6.5 15 9 12.5z"
        ></Path>
      </G>
    </Svg>
  );
}
