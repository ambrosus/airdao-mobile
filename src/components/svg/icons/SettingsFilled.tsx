import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export function SettingsFilledIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral900 } = props;
  const width = moderateScale(20),
    height = moderateScale(20);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M10.013.25c.734.008 1.465.093 2.181.253a.75.75 0 01.582.649l.17 1.527a1.384 1.384 0 001.928 1.116l1.4-.615a.75.75 0 01.85.174 9.793 9.793 0 012.204 3.792.75.75 0 01-.271.825l-1.242.916a1.38 1.38 0 00.001 2.226l1.243.915a.75.75 0 01.271.826 9.798 9.798 0 01-2.203 3.792.75.75 0 01-.849.175l-1.406-.617a1.38 1.38 0 00-1.927 1.114l-.169 1.526a.75.75 0 01-.572.647 9.518 9.518 0 01-4.405 0 .75.75 0 01-.572-.647l-.17-1.524a1.382 1.382 0 00-1.924-1.11l-1.407.616a.75.75 0 01-.849-.175 9.798 9.798 0 01-2.203-3.796.75.75 0 01.271-.826l1.244-.916a1.38 1.38 0 000-2.226L.945 7.973a.75.75 0 01-.272-.826 9.793 9.793 0 012.205-3.792.75.75 0 01.849-.174l1.4.615a1.387 1.387 0 001.93-1.118l.17-1.526a.75.75 0 01.583-.65C8.53.344 9.261.26 10.013.25zM10 7a3 3 0 100 6 3 3 0 000-6z"
        fill={color}
      />
    </Svg>
  );
}
