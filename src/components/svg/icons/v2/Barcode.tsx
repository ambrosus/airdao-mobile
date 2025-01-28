import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function BarcodeScannerIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const size = 24;
  const scaled = size * scale;
  return (
    <Svg
      width={scaled}
      height={scaled}
      viewBox={`0 0 ${scaled} ${scaled}`}
      fill="none"
    >
      <Path
        d="M21 16V21H3V16H5V19H19V16H21ZM3 11H21V13H3V11ZM21 8H19V5H5V8H3V3H21V8Z"
        fill={color}
      />
    </Svg>
  );
}
