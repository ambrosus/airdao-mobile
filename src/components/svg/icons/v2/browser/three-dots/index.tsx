import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function ThreeDots({ color = COLORS.neutral500 }: IconProps) {
  return (
    <Svg width={4} height={16} fill="none">
      <Path
        fill={color}
        d="M2 .5C1.083.5.333 1.25.333 2.167c0 .916.75 1.666 1.667 1.666s1.667-.75 1.667-1.666C3.667 1.25 2.917.5 2 .5Zm0 11.667c-.917 0-1.667.75-1.667 1.666 0 .917.75 1.667 1.667 1.667s1.667-.75 1.667-1.667c0-.916-.75-1.666-1.667-1.666Zm0-5.834C1.083 6.333.333 7.083.333 8S1.083 9.667 2 9.667 3.667 8.917 3.667 8 2.917 6.333 2 6.333Z"
      />
    </Svg>
  );
}
