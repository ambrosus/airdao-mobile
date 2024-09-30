import React from 'react';
import { Row } from '@components/base';
import { scale } from '@utils/scaling';
import { Swap } from './Swap';
import { Send } from './Send';
import { Staking } from './Staking';
import { Bridge } from './Bridge';
import { Token } from '@models';
import { Kosmos } from './Kosmos';

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
      style={{ columnGap: scale(30) }}
    >
      <Swap />
      <Send address={address} token={token} />
      <Staking />
      <Bridge />
      <Kosmos />
    </Row>
  );
};
