import React from 'react';
import { Row } from '@components/base';
import { scale } from '@utils/scaling';
import { Swap } from './Swap';
import { Send } from './Send';
import { Receive } from './Receive';
import { Staking } from './Staking';

interface AccountActionsProps {
  address: string;
}
export const AccountActions = (props: AccountActionsProps) => {
  const { address } = props;
  return (
    <Row
      alignItems="center"
      justifyContent="center"
      style={{ columnGap: scale(40) }}
    >
      <Swap />
      <Send />
      <Receive address={address} />
      <Staking />
    </Row>
  );
};
