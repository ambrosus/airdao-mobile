import React from 'react';
import { Row } from '@components/base';
import { RightArrowInCircle } from '@components/svg/icons';
import { BridgeNetworkPicker } from './BridgeNetworkPicker/BridgeNetwork.Picker';

export const BridgeNetworkSelectors = () => {
  return (
    <Row alignItems="flex-end" justifyContent="space-between">
      <BridgeNetworkPicker type="from" />
      <RightArrowInCircle scale={0.9} />
      <BridgeNetworkPicker type="destination" />
    </Row>
  );
};
