import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function TrashIcon(props: IconProps) {
  const { scale = 1, color = COLORS.black } = props;
  const width = 21;
  const height = 21;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={'0 0 25 25'}
      fill="none"
    >
      <Path
        fill={color}
        d="M20 7.5v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-14H2v-2h20v2h-2Zm-9 2v2h2v-2h-2Zm0 3v2h2v-2h-2Zm0 3v2h2v-2h-2Zm-4-13h10v2H7v-2Z"
      />
    </Svg>
  );
}
