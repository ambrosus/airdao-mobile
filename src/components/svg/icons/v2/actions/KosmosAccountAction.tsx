import { G, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function KosmosAccountActionIcon({
  scale = 1,
  color = COLORS.brand600
}: IconProps) {
  const size = 24;
  const scaled = size * scale;

  return (
    <Svg
      width={scaled}
      height={scaled}
      fill="none"
      viewBox={`0 0 ${scaled} ${scaled}`}
    >
      <G>
        <Path
          fill={color}
          d="M3 12h4v9H3v-9zm14-4h4v13h-4V8zm-7-6h4v19h-4V2z"
        ></Path>
      </G>
    </Svg>
  );
}
