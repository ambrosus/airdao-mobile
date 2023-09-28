import React from 'react';
import { useTranslation } from 'react-i18next';
import { SwapIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';

export const Swap = () => {
  const { t } = useTranslation();

  return (
    <AccountActionButton
      Icon={SwapIcon}
      text={t('account.actions.swap')}
      isActive={Config.walletActions.swap}
    />
  );
};
