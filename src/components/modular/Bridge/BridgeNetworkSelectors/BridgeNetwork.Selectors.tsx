import React from 'react';
import { styles } from './styles';
import { Button, Row } from '@components/base';
import { RightArrowIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { BridgeNetworkPicker } from '@components/modular/Bridge';

export const BridgeNetworkSelectors = () => {
  return (
    <Row alignItems="flex-end" justifyContent="space-between">
      <BridgeNetworkPicker destination="from" />
      <Button style={styles.reorder}>
        <RightArrowIcon color={COLORS.black} />
      </Button>
      <BridgeNetworkPicker destination="to" />
    </Row>
  );
};
