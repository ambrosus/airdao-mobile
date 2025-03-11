import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function AboutIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;

  return (
    <Svg width={25 * scale} height={25 * scale} fill="none" {...props}>
      <Path
        fill={color}
        d="M4.5 5.482a2.5 2.5 0 0 1 2.5-2.5h11.5a2.5 2.5 0 0 1 2.5 2.5v14.25a.75.75 0 0 1-.75.75H6a1 1 0 0 0 1 1h13.25a.75.75 0 0 1 0 1.5H7a2.5 2.5 0 0 1-2.5-2.5v-15Zm8.25 3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-.75 1.75v5a.75.75 0 0 0 1.5 0v-5a.75.75 0 0 0-1.5 0Z"
      />
    </Svg>
  );
}
