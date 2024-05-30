import React from 'react';
import { useTranslation } from 'react-i18next';
import { SwapIcon } from '@components/svg/icons';
import { useNavigation } from '@react-navigation/native';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';
import { HomeNavigationProp } from '@appTypes';

export const Swap = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const onSwapPress = () => navigation.navigate('DEXSwapScreen');

  return (
    <AccountActionButton
      Icon={(props) => <SwapIcon {...props} scale={0.625} />}
      text={t('token.actions.swap')}
      isActive={Config.walletActions.swap}
      onPress={onSwapPress}
    />
  );
};
