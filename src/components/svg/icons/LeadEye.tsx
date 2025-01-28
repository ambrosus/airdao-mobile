import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function LeadEyeIcon({ color = COLORS.neutral0, scale = 1 }: IconProps) {
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
          d="M3.76 11.707c.683-3.275 3.534-5.602 6.74-5.602 3.206 0 6.057 2.327 6.74 5.602a.5.5 0 00.98-.204c-.777-3.725-4.027-6.398-7.72-6.398-3.693 0-6.943 2.673-7.72 6.398a.5.5 0 00.98.204zm6.73-3.602a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"
        ></Path>
      </G>
    </Svg>
  );
}
