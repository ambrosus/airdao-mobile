import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export const NoteIcon = ({ scale = 1, color = COLORS.neutral600 }) => {
  const width = 20 * scale;
  const height = 20 * scale;

  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fill={color}
        d="M13.333 3.542a1.878 1.878 0 0 1-1.875 1.875H8.542c-.517 0-.984-.209-1.325-.55a1.864 1.864 0 0 1-.55-1.325c0-1.034.841-1.875 1.875-1.875h2.916c.517 0 .984.208 1.325.55.342.341.55.808.55 1.325Z"
      />
      <Path
        fill={color}
        d="M15.692 4.192a2.357 2.357 0 0 0-.642-.375c-.242-.092-.483.1-.533.35a3.114 3.114 0 0 1-3.059 2.5H8.542a3.102 3.102 0 0 1-2.209-.917 3.084 3.084 0 0 1-.85-1.575c-.05-.25-.3-.45-.541-.35-.967.392-1.609 1.275-1.609 3.05V15c0 2.5 1.492 3.333 3.334 3.333h6.666c1.842 0 3.334-.833 3.334-3.333V6.875c0-1.358-.375-2.192-.975-2.683Zm-9.025 6.016H10a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625H6.667a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625Zm6.666 4.584H6.667a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h6.666a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625Z"
      />
    </Svg>
  );
};
