import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
export const SearchLargeIcon = (props: IconProps) => (
  <Svg width={29} height={29} fill="none" {...props}>
    <Path
      fill="#46464D"
      d="M12.479 3.019a9 9 0 1 0 5.617 16.031l6.676 6.676a1 1 0 0 0 1.414-1.415l-6.675-6.675a9 9 0 0 0-7.032-14.618Zm-7 9a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
    />
  </Svg>
);
