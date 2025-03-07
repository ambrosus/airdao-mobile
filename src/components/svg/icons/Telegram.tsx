import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function TelegramIcon(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = 14;
  const height = 13;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M13.805.137a.563.563 0 00-.572-.098L.567 4.996a.889.889 0 00.152 1.7L4 7.341V11a.995.995 0 00.625.927.994.994 0 001.095-.233l1.582-1.642 2.51 2.198a.992.992 0 00.97.2.99.99 0 00.667-.726L13.986.687a.563.563 0 00-.18-.55zM10.471 11.5L5.304 6.969l7.437-5.331-2.27 9.862z"
        fill={color}
      />
    </Svg>
  );
}
