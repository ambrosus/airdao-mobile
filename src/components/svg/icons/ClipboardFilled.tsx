import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function ClipboardFilledIcon(props: IconProps) {
  const { color = '#2f2b4380', scale = 1 } = props;
  const width = 12,
    height = 16;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M2 2a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V2zM0 4a2 2 0 011-1.732V12.5A2.5 2.5 0 003.5 15h6.232A2 2 0 018 16H3.5A3.5 3.5 0 010 12.5V4z"
        fill={color}
      />
    </Svg>
  );
}
