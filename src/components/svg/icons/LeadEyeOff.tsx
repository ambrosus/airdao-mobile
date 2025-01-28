import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function LeadEyeOffIcon({
  color = COLORS.neutral0,
  scale = 1
}: IconProps) {
  const width = 21;
  const height = 21;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <G>
        <Path
          fill={color}
          d="M3.385 2.633a.5.5 0 10-.707.707l3.499 3.5a8.097 8.097 0 00-3.366 5.045.5.5 0 00.98.204 7.09 7.09 0 013.107-4.528l1.587 1.586a3.5 3.5 0 104.886 4.886l4.307 4.307a.5.5 0 00.707-.707l-15-15zm9.266 10.68a2.5 2.5 0 11-3.446-3.446l3.446 3.446zM10.655 8.49l3.374 3.374a3.5 3.5 0 00-3.374-3.374zm-.124-2.002c-.57 0-1.128.073-1.666.213l-.803-.803a7.648 7.648 0 012.47-.41c3.693 0 6.942 2.673 7.72 6.398a.5.5 0 01-.98.204c-.683-3.275-3.535-5.602-6.74-5.602z"
        ></Path>
      </G>
    </Svg>
  );
}
