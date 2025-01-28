import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function LockIcon(props: IconProps) {
  const { color = COLORS.brand500 } = props;

  return (
    <Svg width={25} height={25} fill="none" {...props}>
      <Path
        fill={color}
        d="M12.5 2.982a4 4 0 0 1 4 4v2H19a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-11a1.5 1.5 0 0 1 1.5-1.5h2.5v-2a4 4 0 0 1 4-4Zm0 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0-9.5a2 2 0 0 0-2 2v2h4v-2a2 2 0 0 0-2-2Z"
      />
    </Svg>
  );
}
