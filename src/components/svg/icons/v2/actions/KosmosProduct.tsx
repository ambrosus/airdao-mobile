import { Circle, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function KosmosProductIcon({
  scale = 1,
  color = COLORS.neutral0
}: IconProps) {
  const size = 24;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none" viewBox="0 0 60 60">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M58.194 19.718c-3.442-6.043-9.941-10.117-17.392-10.117-11.047 0-20.001 8.954-20.001 20 0 11.047 8.954 20.001 20 20.001 7.976 0 14.86-4.668 18.073-11.42-3.561 12.593-15.14 21.82-28.873 21.82C13.432 60.003 0 46.572 0 30.002S13.432 0 30.001 0c12.957 0 23.995 8.214 28.193 19.718"
        clipRule="evenodd"
      ></Path>
      <Circle cx="50.217" cy="29.348" r="9.783" fill="#fff"></Circle>
    </Svg>
  );
}
