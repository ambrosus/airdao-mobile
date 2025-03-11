import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function ProductSwap({ scale = 1, color = COLORS.pink }: IconProps) {
  const size = 45;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none">
      <Path
        fill={color}
        d="M44.333 15.167c0 6.309-3.852 11.718-9.333 14.004v-.004c0-10.954-8.88-19.834-19.833-19.834h-.005C17.448 3.853 22.858 0 29.167 0c8.376 0 15.166 6.79 15.166 15.167Zm-33.833-14A9.333 9.333 0 0 0 1.167 10.5V14h4.666v-3.5A4.667 4.667 0 0 1 10.5 5.833H14V1.167h-3.5Zm28 29.166v3.5a4.667 4.667 0 0 1-4.667 4.667h-3.5v4.667h3.5a9.334 9.334 0 0 0 9.334-9.334v-3.5H38.5Zm-23.333 14c8.376 0 15.166-6.79 15.166-15.166C30.333 20.79 23.543 14 15.167 14 6.79 14 0 20.79 0 29.167c0 8.376 6.79 15.166 15.167 15.166Zm0-21L21 29.167 15.167 35l-5.834-5.833 5.834-5.834Z"
      />
    </Svg>
  );
}
