import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function ProbitIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 22;
  const height = 22;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M19.341 5.293L10.753.373a1.195 1.195 0 00-1.072 0l-8.588 4.92a1.203 1.203 0 00-.536.927v9.838a1.199 1.199 0 00.536.928l8.588 4.92a1.195 1.195 0 001.072 0l8.588-4.92a1.202 1.202 0 00.536-.928V6.22a1.198 1.198 0 00-.536-.927zM15.52 7.576l-4.886 2.868a1.152 1.152 0 01-1.072 0L6.46 8.63c-.381-.232-.706-.05-.706.393v5.488a.441.441 0 01-.461.51.444.444 0 01-.244-.088l-.529-.274a1.141 1.141 0 01-.55-.914V7.787a1.199 1.199 0 01.536-.927l5.05-2.924a1.195 1.195 0 011.07 0l4.887 2.811a.43.43 0 01.325.412.428.428 0 01-.317.417z"
        fill="#3668DD"
      />
    </Svg>
  );
}
