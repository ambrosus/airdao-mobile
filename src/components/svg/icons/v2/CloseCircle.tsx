import { G, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function CloseCircleIcon({
  scale = 1,
  color = COLORS.neutral500
}: IconProps) {
  const width = 24;
  const height = 25;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <G>
        <Path
          fill={color}
          d="M12 22.5c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-9.414l2.828-2.829 1.415 1.415-2.829 2.828 2.829 2.828-1.415 1.415L12 13.914l-2.828 2.829-1.415-1.415 2.829-2.828-2.829-2.828 1.415-1.415L12 11.086z"
        ></Path>
      </G>
    </Svg>
  );
}
