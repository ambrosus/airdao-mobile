import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { SwapIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';

export const Swap = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToSwap = () => {
    navigation.navigate('Swap');
  };

  return (
    <AccountActionButton
      Icon={(props) => <SwapIcon {...props} scale={0.625} />}
      onPress={navigateToSwap}
      text={t('token.actions.swap')}
      isActive={Config.walletActions.swap}
    />
  );
};
