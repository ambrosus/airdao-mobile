import React, { ComponentType, useCallback } from 'react';
import { Row } from '@components/base';
import { AccountActionsKey } from './ActionButton.types';
import { scale } from '@utils/scaling';
import { Send, Swap, Staking, Bridge, Kosmos } from './components';
import { ExplorerAccount, Token } from '@models';
import Config from '@constants/config';

interface AccountActionsProps {
  account: ExplorerAccount;
  token?: Token;
  disabled: boolean;
}

type ActionComponentProps = {
  disabled: () => boolean;
  account?: ExplorerAccount;
  token?: Token;
};

export const AccountActions = ({
  account,
  token,
  disabled
}: AccountActionsProps) => {
  const _isRouteActive = useCallback(
    (key: string) => {
      return !disabled && Config.walletActions[key];
    },
    [disabled]
  );

  const actionComponents: {
    Component: ComponentType<ActionComponentProps>;
    key: string;
    props: ActionComponentProps;
  }[] = [
    {
      // @ts-ignore
      Component: Send,
      key: AccountActionsKey.SEND,
      props: {
        account,
        token,
        disabled: () => _isRouteActive(AccountActionsKey.SEND)
      }
    },
    {
      Component: Swap,
      key: AccountActionsKey.SWAP,
      props: { disabled: () => _isRouteActive(AccountActionsKey.SWAP) }
    },
    {
      Component: Staking,
      key: AccountActionsKey.STAKE,
      props: { disabled: () => _isRouteActive(AccountActionsKey.STAKE) }
    },
    {
      Component: Bridge,
      key: AccountActionsKey.BRIDGE,
      props: { disabled: () => _isRouteActive(AccountActionsKey.BRIDGE) }
    },
    {
      Component: Kosmos,
      key: AccountActionsKey.KOSMOS,
      props: { disabled: () => _isRouteActive(AccountActionsKey.KOSMOS) }
    }
  ];

  return (
    <Row
      alignItems="center"
      justifyContent="center"
      style={{ columnGap: scale(30) }}
    >
      {actionComponents.map(({ Component, key, props }) => (
        <Component key={key} {...props} />
      ))}
    </Row>
  );
};
