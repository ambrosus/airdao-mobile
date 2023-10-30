import React from 'react';
import { useTranslation } from 'react-i18next';
import { StakeRocketIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';

export const Staking = () => {
  const { t } = useTranslation();

  return (
    <AccountActionButton
      Icon={StakeRocketIcon}
      text={t('account.actions.stake')}
      isActive={Config.walletActions.stake}
    />
  );
};
