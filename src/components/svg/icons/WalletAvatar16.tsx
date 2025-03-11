import { Defs, Path, Svg, ClipPath, G } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatar16(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 128;
  const height = 128;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <G clipPath="url(#prefix__clip0_1387_183)">
        <Path fill="#E6E6E6" d="M.08.434h126.694v128.478H.08z" />
        <Path
          d="M32.301-112.218c13.824-23.318 47.574-23.318 61.398 0l41.735 70.398 40.099 71.343c13.282 23.631-3.593 52.86-30.699 53.172L63 83.64l-81.834-.945c-27.106-.313-43.981-29.541-30.7-53.172l40.1-71.343L32.3-112.218z"
          fill="#457EFF"
          stroke="#191919"
          strokeWidth={5.353}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1387_183">
          <Path
            fill="#fff"
            transform="translate(.08 .434)"
            d="M0 0h126.694v128.478H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
