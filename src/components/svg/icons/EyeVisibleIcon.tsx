import React from 'react';
import { Image } from 'react-native';
import { IconProps } from './Icon.types';

export function EyeVisibleIcon(props: Pick<IconProps, 'size'>) {
  const { size = 20 } = props;
  return (
    <Image
      source={require('../../../assets/icons/eye-visible.png')}
      style={{ height: size, width: size }}
    />
  );
}
