import React from 'react';
import {
  AddressTrackingIcon,
  SendReceiveIcon,
  StayInformedIcon
} from '@components/svg/icons';
import { StepInfo } from './components';
import ShowDeviceInfo from '@components/composite/ShodDeviceinfo';

export const NoWalletSteps: StepInfo[] = [
  {
    image: <SendReceiveIcon />,
    title: 'no.wallet.send.receive',
    description: 'no.wallet.send.receive.description'
  },
  {
    image: <AddressTrackingIcon />,
    title: 'no.wallet.address.tracking',
    description: 'no.wallet.address.tracking.description'
  },
  {
    image: <StayInformedIcon />,
    title: 'no.wallet.stay.informed',
    description: 'no.wallet.stay.informed.description'
  },
  // only for dev
  {
    image: <ShowDeviceInfo />,
    title: '',
    description: ''
  }
];
