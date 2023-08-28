import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';

export function AssetLogo(props: IconProps) {
  const { scale = 1 } = props;
  const width = 41;
  const height = 40;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M11.8397 4.99995C17.1987 1.90594 23.8012 1.90594 29.1602 4.99995C34.5192 8.09396 37.8205 13.8119 37.8205 20C37.8205 26.188 34.5192 31.9059 29.1602 35C23.8012 38.094 17.1987 38.094 11.8397 35C6.48072 31.9059 3.17944 26.188 3.17944 20C3.17944 13.8119 6.48071 8.09396 11.8397 4.99995Z"
        fill="#457EFF"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.7223 29.3721C13.5999 29.4467 13.4403 29.4121 13.3598 29.2934L13.0514 28.8387C12.9709 28.72 12.9979 28.5592 13.1109 28.4708C14.1267 27.676 14.9616 26.7801 15.6183 25.8206C18.0633 22.2479 18.0633 17.752 15.6183 14.1793C14.9616 13.2198 14.1267 12.3239 13.1109 11.5291C12.9979 11.4407 12.9709 11.2799 13.0514 11.1612L13.3598 10.7065C13.4403 10.5878 13.5999 10.5532 13.7223 10.6278L27.4216 18.9788C28.1862 19.4449 28.1862 20.555 27.4216 21.0211L13.7223 29.3721Z"
        fill="white"
      />
    </Svg>
  );
}
