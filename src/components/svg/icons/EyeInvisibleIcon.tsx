import React from 'react';
import { Image } from 'react-native';
import { IconProps } from './Icon.types';

export function EyeInvisibleIcon(props: Pick<IconProps, 'size'>) {
  const { size = 20 } = props;
  return (
    <Image
      source={require('../../../assets/icons/eye-invisible.png')}
      style={{ height: size, width: size }}
    />
  );
}
