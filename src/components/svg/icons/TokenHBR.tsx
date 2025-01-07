import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function HBRIcon({ scale = 1 }: IconProps) {
  const size = 29 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 33" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 16.6958C2 9.68803 6.93003 3.84256 13.4802 2.50022V7.10895C9.79249 8.23249 7.01095 11.4646 6.51161 15.4164H10.94C11.5733 13.0201 13.7561 11.2536 16.3514 11.2536C18.9467 11.2536 21.1295 13.0201 21.7628 15.4164H26.1903C25.6909 11.4642 22.9089 8.23187 19.2206 7.10862V2.5C25.7713 3.84192 30.7019 9.68765 30.7019 16.6958C30.7019 24.6958 24.2768 31.1812 16.351 31.1812C8.42514 31.1812 2 24.6958 2 16.6958ZM26.146 18.2866L21.7623 18.2866C21.2496 20.2235 19.7245 21.7487 17.7876 22.2614V26.604C22.0696 25.977 25.4655 22.589 26.146 18.2866ZM14.9174 26.6045V22.262C12.9794 21.7498 11.4534 20.2242 10.9405 18.2866L6.5559 18.2866C7.23656 22.59 10.6339 25.9786 14.9174 26.6045Z"
        fill="#FFC93E"
      />
    </Svg>
  );
}
