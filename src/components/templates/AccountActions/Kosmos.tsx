import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { KosmosIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';
import { HomeNavigationProp } from '@appTypes';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';

export const Kosmos = () => {
  const navigation: HomeNavigationProp = useNavigation();

  const onNavigateToKosmos = () => {
    sendFirebaseEvent(CustomAppEvents.main_kosmos);
    navigation.navigate('KosmosScreen');
  };

  return (
    <AccountActionButton
      Icon={KosmosIcon}
      onPress={onNavigateToKosmos}
      text="KOSMOS"
      isActive={Config.walletActions.kosmos}
    />
  );
};
