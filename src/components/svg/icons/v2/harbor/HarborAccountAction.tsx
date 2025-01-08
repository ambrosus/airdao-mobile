import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export const HarborAccountAction = ({ scale = 1 }: { scale?: number }) => {
  const width = 64 * scale;
  const height = 64 * scale;

  return (
    <Svg width={width} height={height} fill="none">
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M.749 27.367c0-13.14 9.244-24.1 21.525-26.617v8.642c-6.914 2.106-12.13 8.166-13.066 15.576h8.304c1.188-4.493 5.28-7.805 10.146-7.805 4.867 0 8.96 3.312 10.147 7.805h8.3c-.935-7.41-6.152-13.47-13.067-15.577V.75C45.32 3.266 54.565 14.227 54.565 27.367c0 15-12.047 27.16-26.908 27.16-14.86 0-26.908-12.16-26.908-27.16Zm45.274 2.983h-8.22a10.513 10.513 0 0 1-7.452 7.453v8.142c8.029-1.176 14.396-7.528 15.672-15.595ZM24.969 45.946v-8.142a10.513 10.513 0 0 1-7.456-7.454H9.29c1.277 8.069 7.647 14.422 15.678 15.596Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};
