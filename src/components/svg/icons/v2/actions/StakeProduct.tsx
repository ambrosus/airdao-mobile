import { Circle, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function StakeProductIcon({ scale = 1 }: IconProps) {
  const size = 24;
  const scaled = size * scale;

  return (
    <Svg width={scaled} height={scaled} fill="none" viewBox="0 0 60 60">
      <Circle cx="30.004" cy="30.001" r="24" fill="#fff"></Circle>
      <Circle cx="30" cy="30" r="29.5" stroke="#fff"></Circle>
      <Path
        fill={COLORS.brand600}
        fillRule="evenodd"
        d="M22.149 45.074a.43.43 0 0 1-.58-.126l-.495-.728a.437.437 0 0 1 .096-.59 19.1 19.1 0 0 0 4.014-4.242c3.915-5.72 3.915-12.919 0-18.639a19.1 19.1 0 0 0-4.014-4.243.437.437 0 0 1-.096-.589l.494-.728a.43.43 0 0 1 .58-.126l21.934 13.37a1.915 1.915 0 0 1 0 3.27z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
}
