import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function StakeHBRIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const width = 25;
  const height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      fill="none"
    >
      <Path
        fill={color}
        d="M10.505 20.003c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-3-12h6l2.5 3.5-5.5 5.5-5.5-5.5 2.5-3.5Zm1.03 2-.92 1.29 2.89 2.89 2.89-2.89-.92-1.29h-3.94Z"
      />
    </Svg>
  );
}
