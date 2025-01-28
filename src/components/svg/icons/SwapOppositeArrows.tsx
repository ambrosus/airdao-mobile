import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from './Icon.types';

export function SwapOppositeArrowsIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand600 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <G clipPath="url(#prefix__clip0_1214_10744)">
        <Path
          d="M5.333 9l.01.133a1 1 0 00.99.867h16.923l-4.29 4.293-.097.112a1 1 0 001.512 1.302l6-6.006.096-.112a1 1 0 00-.097-1.3l-6-5.997-.112-.096a1 1 0 00-1.303.097l-.096.112a1 1 0 00.098 1.303L23.26 8H6.333l-.136.008A1 1 0 005.333 9zm.294 14.715l5.993 5.992.112.097a1 1 0 001.301-.097l.098-.112a1 1 0 00-.098-1.302l-4.29-4.289h16.93l.136-.01a1 1 0 00.864-.991l-.009-.135a1 1 0 00-.99-.865l-16.929.001 4.29-4.297.096-.112a1 1 0 00-1.512-1.3L5.627 22.3l-.096.113a1 1 0 00.097 1.302h-.001z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1214_10744">
          <Path fill="#fff" d="M0 0h32v32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
