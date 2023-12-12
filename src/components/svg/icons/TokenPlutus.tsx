import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function PlutusIcon(props: Omit<IconProps, 'color'>) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z"
        fill="#24DD9A"
      />
      <Path
        d="M9.333 21.333h8V24h-8v-2.667zM17.333 21.333H12V8h6.782c1.013 0 1.925.116 2.735.35.81.225 1.497.556 2.06.993.57.43 1.006.958 1.306 1.584.3.626.45 1.332.45 2.119 0 .859-.165 1.63-.495 2.315a5.36 5.36 0 01-1.328 1.747 5.875 5.875 0 01-1.903 1.093 6.736 6.736 0 01-2.262.382h-.327a4.45 4.45 0 01-.383-.044v-2.195c.083.014.35.222.44.23h.258c.413 0 .785-.077 1.115-.23.33-.153.608-.364.833-.634.233-.276.409-.607.529-.993A4.09 4.09 0 0022 13.428c0-.583-.082-1.081-.247-1.496a2.54 2.54 0 00-.71-1.016 2.82 2.82 0 00-1.114-.579 5.347 5.347 0 00-1.463-.185h-1.134v11.181z"
        fill="#fff"
      />
    </Svg>
  );
}
