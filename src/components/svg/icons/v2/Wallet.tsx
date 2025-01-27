import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function WalletIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const size = 16 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12.0026 4.66642H14.0026C14.3708 4.66642 14.6693 4.9649 14.6693 5.33309V13.3331C14.6693 13.7013 14.3708 13.9998 14.0026 13.9998H2.0026C1.63442 13.9998 1.33594 13.7013 1.33594 13.3331V2.66642C1.33594 2.29823 1.63442 1.99976 2.0026 1.99976H12.0026V4.66642ZM2.66927 5.99976V12.6664H13.336V5.99976H2.66927ZM2.66927 3.33309V4.66642H10.6693V3.33309H2.66927ZM10.0026 8.66643H12.0026V9.99976H10.0026V8.66643Z"
        fill={color}
      />
    </Svg>
  );
}
