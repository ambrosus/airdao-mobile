import React from 'react';
import { Row } from '@components/base';
import { scale } from '@utils/scaling';
import { Swap } from './Swap';
import { Send } from './Send';
import { Receive } from './Receive';
import { Staking } from './Staking';

export const AccountActions = () => {
  return (
    <Row
      alignItems="center"
      justifyContent="center"
      style={{ columnGap: scale(40) }}
    >
      <Swap />
      <Send />
      <Receive />
      <Staking />
    </Row>
  );
};
