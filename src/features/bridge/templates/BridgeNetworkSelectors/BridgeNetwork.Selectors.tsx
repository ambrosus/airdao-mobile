import React from 'react';
import { Row } from '@components/base';
import { BridgeNetworkPicker } from './BridgeNetworkPicker/BridgeNetwork.Picker';
import { RightArrowInCircle } from '@components/svg/icons';

export const BridgeNetworkSelectors = () => {
  return (
    <Row alignItems="flex-end" justifyContent="space-between">
      <BridgeNetworkPicker destination="from" />
      <RightArrowInCircle />
      <BridgeNetworkPicker destination="to" />
    </Row>
  );
};
