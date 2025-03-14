import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function RefreshIcon({ scale = 1, color = COLORS.neutral800 }) {
  const size = 21 * scale;
  return (
    <Svg width={size} height={size} fill="none">
      <Path
        fill={color}
        d="M20 10.5c0 5.523-4.477 10-10 10s-10-4.477-10-10S4.477.5 10 .5v2a8 8 0 1 0 4.5 1.385V6.5h-2v-6h6v2H16a9.985 9.985 0 0 1 4 8Z"
      />
    </Svg>
  );
}
