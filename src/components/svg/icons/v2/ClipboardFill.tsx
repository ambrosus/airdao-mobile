import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function ClipboardFillIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const size = 14 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 12 14" fill="none">
      <Path
        d="M2.66653 3.00065V1.00065C2.66653 0.632464 2.96501 0.333984 3.3332 0.333984H11.3332C11.7014 0.333984 11.9999 0.632464 11.9999 1.00065V10.334C11.9999 10.7022 11.7014 11.0007 11.3332 11.0007H9.3332V13.0001C9.3332 13.3686 9.03327 13.6673 8.662 13.6673H0.671107C0.300393 13.6673 0 13.3709 0 13.0001L0.0017333 3.6679C0.00179997 3.29939 0.30176 3.00065 0.672947 3.00065H2.66653ZM3.99987 3.00065H9.3332V9.66732H10.6665V1.66732H3.99987V3.00065Z"
        fill={color}
        fillOpacity="0.8"
      />
    </Svg>
  );
}
