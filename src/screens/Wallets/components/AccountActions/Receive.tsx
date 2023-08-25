import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiveQRCodeIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';

export const Receive = () => {
  const { t } = useTranslation();

  const showReceiveFunds = () => {
    // TODO
  };

  return (
    <AccountActionButton
      Icon={ReceiveQRCodeIcon}
      text={t('account.actions.receive')}
      isActive={Config.walletActions.receive}
      onPress={showReceiveFunds}
    />
  );
};
