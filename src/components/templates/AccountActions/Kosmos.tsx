import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { KosmosIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';
import { HomeNavigationProp } from '@appTypes';

export const Kosmos = () => {
  const navigation: HomeNavigationProp = useNavigation();

  const onNavigateToKosmos = () => navigation.navigate('KosmosScreen');

  return (
    <AccountActionButton
      Icon={KosmosIcon}
      onPress={onNavigateToKosmos}
      text="KOSMOS"
      isActive={Config.walletActions.kosmos}
    />
  );
};
