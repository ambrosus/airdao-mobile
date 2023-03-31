import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function AddIcon(props: IconProps) {
  const { width = 16, height = 16 } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8.5 0.752319C8.5 0.338106 8.16421 0.00231934 7.75 0.00231934C7.33579 0.00231934 7 0.338106 7 0.752319V7.00232H0.75C0.335786 7.00232 0 7.33811 0 7.75232C0 8.16653 0.335786 8.50232 0.75 8.50232H7V14.7523C7 15.1665 7.33579 15.5023 7.75 15.5023C8.16421 15.5023 8.5 15.1665 8.5 14.7523V8.50232H14.75C15.1642 8.50232 15.5 8.16653 15.5 7.75232C15.5 7.33811 15.1642 7.00232 14.75 7.00232H8.5V0.752319Z"
        fill="white"
      />
    </Svg>
  );
}
