import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export const StakeIcon = ({ scale = 1, color = COLORS.neutral600 }) => {
  const width = 20 * scale;
  const height = 20 * scale;

  return (
    <Svg width={width} height={height} fill="none">
      <Path
        fill={color}
        d="M14 7.5h-3.375v3.7l1.725-1.725a.618.618 0 0 1 .442-.183c.158 0 .316.058.441.183a.629.629 0 0 1 0 .883l-2.791 2.792a.629.629 0 0 1-.884 0l-2.791-2.792a.629.629 0 0 1 0-.883.629.629 0 0 1 .883 0L9.375 11.2V7.5H6c-2.667 0-4.333 1.667-4.333 4.333v2.159c0 2.675 1.666 4.341 4.333 4.341h7.992c2.666 0 4.333-1.666 4.333-4.333v-2.167C18.333 9.167 16.667 7.5 14 7.5ZM10.625 2.292A.63.63 0 0 0 10 1.667a.63.63 0 0 0-.625.625V7.5h1.25V2.292Z"
      />
    </Svg>
  );
};
