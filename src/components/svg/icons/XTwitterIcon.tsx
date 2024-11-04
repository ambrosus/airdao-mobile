import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';
import { scale as scaleFunc } from '@utils/scaling';

const XTwitterIcon = (props: IconProps) => {
  const { scale = 1, color = COLORS.brand500 } = props;

  return (
    <Svg
      width={scaleFunc(25) * scale}
      height={scaleFunc(24) * scale}
      fill="none"
      {...props}
    >
      <Path
        fill={color}
        d="M17.61 3.951h2.724l-5.953 6.804 7.004 9.258H15.9l-4.294-5.616-4.915 5.616H3.966l6.368-7.278-6.719-8.783h5.623l3.882 5.132 4.49-5.133Zm-.956 14.431h1.51L8.416 5.496h-1.62l9.857 12.886Z"
      />
    </Svg>
  );
};
export default XTwitterIcon;
