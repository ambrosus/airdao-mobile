import React from 'react';
import { Row } from '@components/base';
import { scale } from '@utils/scaling';
import { Swap } from './Swap';
import { Send } from './Send';
import { Receive } from './Receive';
import { Staking } from './Staking';
import { Token } from '@models';

interface AccountActionsProps {
  address: string;
  token?: Token;
}
export const AccountActions = (props: AccountActionsProps) => {
  const { address, token } = props;
  return (
    <Row
      alignItems="center"
      justifyContent="center"
      style={{ columnGap: scale(40) }}
    >
      <Swap />
      <Send address={address} token={token} />
      <Receive address={address} />
      <Staking />
    </Row>
  );
};
