import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';

export function FilterIcon(props: IconProps) {
  const { width = 18, height = 12 } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 18 12" fill="none">
      <Path
        d="M10.5 10C10.9142 10 11.25 10.3358 11.25 10.75C11.25 11.1642 10.9142 11.5 10.5 11.5H7.5C7.08579 11.5 6.75 11.1642 6.75 10.75C6.75 10.3358 7.08579 10 7.5 10H10.5ZM13.5 5C13.9142 5 14.25 5.33579 14.25 5.75C14.25 6.16421 13.9142 6.5 13.5 6.5H4.5C4.08579 6.5 3.75 6.16421 3.75 5.75C3.75 5.33579 4.08579 5 4.5 5H13.5ZM16.5 0C16.9142 0 17.25 0.335786 17.25 0.75C17.25 1.16421 16.9142 1.5 16.5 1.5H1.5C1.08579 1.5 0.75 1.16421 0.75 0.75C0.75 0.335786 1.08579 0 1.5 0H16.5Z"
        fill="black"
      />
    </Svg>
  );
}
