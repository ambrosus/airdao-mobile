import React from 'react';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';

export const Send = () => {
  const { t } = useTranslation();

  const navigateToSendScreen = () => {
    // TODO
  };

  return (
    <AccountActionButton
      Icon={SendIcon}
      text={t('account.actions.send')}
      isActive={Config.walletActions.send}
      onPress={navigateToSendScreen}
    />
  );
};
