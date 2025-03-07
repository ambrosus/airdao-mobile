import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WatchlistEmptyIcon({
  color = '#A1A6B2',
  scale = 1
}: IconProps) {
  const width = 41;
  const height = 34;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <Path
        fill={color}
        d="M10.732 2.5C13.358.996 16.582 0 20.5 0h.001c7.693 0 12.716 3.843 15.774 7.827a24.763 24.763 0 013.23 5.635c.333.814.575 1.537.735 2.116.148.532.26 1.057.26 1.422s-.112.89-.26 1.422a19.38 19.38 0 01-.734 2.116 24.763 24.763 0 01-3.23 5.635C33.216 30.157 28.193 34 20.5 34H20.5c-3.917 0-7.142-.996-9.768-2.5h9.77v-2H7.881A21.097 21.097 0 015.391 27H20.5v-2h-.003a8 8 0 100-16h.003V7H5.391a21.095 21.095 0 012.491-2.5h12.62v-2h-9.77zm3.957 9H2.4c.413-.802.904-1.647 1.48-2.5h16.617c-2.288 0-4.351.96-5.81 2.5zm-1.387 2H1.48a19.31 19.31 0 00-.72 2.078C.72 15.72.683 15.862.65 16h11.91c.11-.887.366-1.728.742-2.5zM12.56 18H.65c.033.138.07.28.11.422.157.57.394 1.28.719 2.078h11.823a7.942 7.942 0 01-.742-2.5zm2.129 4.5a7.977 7.977 0 005.81 2.5H3.88a24.86 24.86 0 01-1.48-2.5h12.288z"
      ></Path>
    </Svg>
  );
}
