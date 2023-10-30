import React from 'react';
import { IconProps, WalletIcon } from '@components/svg/icons';

export function WalletTabIcon(props: Omit<IconProps, 'variant' | 'scale'>) {
  return <WalletIcon {...props} scale={28 / 24} />;
}
