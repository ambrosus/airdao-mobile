import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function SendIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral900 } = props;
  const width = 20,
    height = 20;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <G clipPath="url(#prefix__clip0_1307_4302)">
        <Path
          d="M10.815 10.197l-7.532 1.256a.5.5 0 00-.386.318L.3 18.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 000-1.342l-18-9C.72.022.05.632.299 1.272l2.598 6.957a.5.5 0 00.386.319l7.532 1.255a.2.2 0 010 .394z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1307_4302">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
