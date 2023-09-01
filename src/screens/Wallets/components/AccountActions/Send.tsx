import React from 'react';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';

export const Send = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToSendScreen = () => {
    // TODO
    navigation.navigate('SendFunds');
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
