import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export const CirculationIcon = (props: IconProps) => (
  <Svg width={32} height={28} fill="none" {...props}>
    <Path
      fill="#743DE5"
      d="M21.657 7A8.96 8.96 0 0 0 16 5a9 9 0 1 0 8.956 8.099 1 1 0 0 1 1.99-.198c.036.362.054.729.054 1.099 0 6.075-4.925 11-11 11S5 20.075 5 14 9.925 3 16 3c2.66 0 5.099.944 7 2.514V4a1 1 0 1 1 2 0v4.029A1 1 0 0 1 24 9h-4a1 1 0 1 1 0-2h1.657Z"
    />
  </Svg>
);
