import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '@components/svg/icons/Icon.types';
const MediumIcon = (props: IconProps) => {
  const { scale = 1, color = COLORS.brand500 } = props;

  return (
    <Svg width={25 * scale} height={25 * scale} fill="none" {...props}>
      <Path
        fill={color}
        d="M13.25 12.982a6 6 0 1 1-6-6 6.006 6.006 0 0 1 6 6Zm4.5-6c-.532 0-1.538.26-2.28 1.993-.464 1.082-.72 2.507-.72 4.007 0 1.5.256 2.925.72 4.008.742 1.734 1.748 1.992 2.28 1.992.532 0 1.538-.258 2.28-1.992.464-1.083.72-2.508.72-4.008s-.256-2.925-.72-4.007c-.742-1.734-1.748-1.993-2.28-1.993Zm5.25 0a.75.75 0 0 0-.75.75v10.5a.75.75 0 1 0 1.5 0v-10.5a.75.75 0 0 0-.75-.75Z"
      />
    </Svg>
  );
};
export default MediumIcon;
