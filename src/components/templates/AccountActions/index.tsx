import React from 'react';
import { Row } from '@components/base';
import { scale } from '@utils/scaling';
import { Swap } from './Swap';
import { Send } from './Send';
import { Receive } from './Receive';
import { Staking } from './Staking';
import { Token } from '@models';
import { Bridge } from '@components/templates/AccountActions/Bridge';
import { AccountDBModel } from '@database';

interface AccountActionsProps {
  address: string;
  token?: Token;
  selectedAccount: AccountDBModel | null;
}
export const AccountActions = (props: AccountActionsProps) => {
  const { address, token, selectedAccount } = props;
  return (
    <Row
      alignItems="center"
      justifyContent="center"
      style={{ columnGap: scale(28) }}
    >
      <Swap />
      <Send address={address} token={token} />
      <Receive address={address} />
      <Staking />
      <Bridge selectedAccount={selectedAccount} />
    </Row>
  );
};
