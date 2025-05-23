import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function ClipboardIcon({
  scale = 1,
  color = COLORS.neutral500
}: IconProps) {
  const size = 16 * scale;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Path
        d="M4.66653 3.99967V1.99967C4.66653 1.63149 4.96501 1.33301 5.3332 1.33301H13.3332C13.7014 1.33301 13.9999 1.63149 13.9999 1.99967V11.333C13.9999 11.7012 13.7014 11.9997 13.3332 11.9997H11.3332V13.9991C11.3332 14.3676 11.0333 14.6663 10.662 14.6663H2.67111C2.30039 14.6663 2 14.3699 2 13.9991L2.00173 4.66692C2.0018 4.29841 2.30176 3.99967 2.67295 3.99967H4.66653ZM3.33495 5.33301L3.33346 13.333H9.99987V5.33301H3.33495ZM5.99987 3.99967H11.3332V10.6663H12.6665V2.66634H5.99987V3.99967Z"
        fill={color}
      />
    </Svg>
  );
}
