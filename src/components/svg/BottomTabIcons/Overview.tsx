import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function OverviewTabIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M5.75 3a2.25 2.25 0 012.248 2.25v13.5a2.25 2.25 0 11-4.498 0V5.25A2.25 2.25 0 015.75 3zm6.5 4a2.25 2.25 0 012.248 2.25v9.5a2.25 2.25 0 11-4.498 0v-9.5A2.25 2.25 0 0112.25 7zm6.5 4a2.25 2.25 0 012.248 2.25v5.5a2.25 2.25 0 11-4.498 0v-5.5A2.249 2.249 0 0118.75 11z"
        fill={color}
      />
    </Svg>
  );
}
