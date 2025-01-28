import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductsInnerIcon({
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
      <Path d="M13.5 10H20.5L11.5 23V14H4.5L13.5 1V10Z" fill={color} />
    </Svg>
  );
}
