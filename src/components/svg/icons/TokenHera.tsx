import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function HeraPoolIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M16 32c8.867 0 16-7.133 16-16S24.867 0 16 0 0 7.133 0 16s7.133 16 16 16z"
        fill="#3568DD"
      />
      <Path d="M12 13.333H8v5.334h4v-5.334z" fill="#fff" />
      <Path
        d="M8 18.667h4V24h-1.333A2.667 2.667 0 018 21.333v-2.666zM8 8h1.333A2.667 2.667 0 0112 10.667v2.666H8V8zM22.667 24H24c.736 0 1.333-.597 1.333-1.333v-1.334h-2.666V24zM17.333 8h1.334a2.667 2.667 0 012.666 2.667v2.666h-4V8zM17.333 14.667H12v2.666h5.333v-2.666zM17.333 18.667h4V24H20a2.667 2.667 0 01-2.667-2.667v-2.666z"
        fill="#fff"
      />
      <Path d="M21.333 13.333h-4v5.334h4v-5.334z" fill="#fff" />
    </Svg>
  );
}
