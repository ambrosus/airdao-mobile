import Svg, { Path, Rect } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function TokenXENAIcon({ scale = 1 }: IconProps) {
  const size = 32 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 1080 1080">
      <Rect
        width="128"
        height="128"
        x="-64"
        y="-64"
        fill="#FFF"
        rx="64"
        ry="64"
        transform="translate(540 540)scale(8.44)"
        vectorEffect="non-scaling-stroke"
      ></Rect>
      <Path
        fill="#5E53FF"
        fillRule="evenodd"
        d="M540 1080.16c298.322 0 540.16-241.838 540.16-540.16S838.322-.16 540-.16-.16 241.678-.16 540c0 75.348 15.427 147.092 43.296 212.247L233.75 530.271 91.628 359.945h142.85l70.906 84.81 70.422-84.81h145.9L377.778 530.271l162.216 192.685H395.169l-89.023-107.168-206.05 237.75C198.051 990.72 358.581 1080.16 540 1080.16m45.019-628.973v-91.242h360.11v100.752l-68.525 78.728 68.524 78.515v102.112H585.904v-90.895h240.069l-38.451-43.65H689.05V495.1h98.472l37.942-43.913H585.02"
        vectorEffect="non-scaling-stroke"
      ></Path>
    </Svg>
  );
}
