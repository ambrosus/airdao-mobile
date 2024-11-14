import React from 'react';
import { Row } from '@components/base';
import { BridgeNetworkPicker } from './BridgeNetworkPicker/BridgeNetwork.Picker';
import { RightArrowInCircle } from '@components/svg/icons';

export const BridgeNetworkSelectors = () => {
  return (
    <Row alignItems="flex-end" justifyContent="space-between">
      <BridgeNetworkPicker type="from" />
      <RightArrowInCircle scale={0.9} />
      <BridgeNetworkPicker type="destination" />
    </Row>
  );
};
