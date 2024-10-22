import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AccountActionButton } from './ActionButton';
import { HomeNavigationProp } from '@appTypes';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { KosmosAccountActionIcon } from '@components/svg/icons/v2/actions';

interface KosmosProps {
  readonly disabled: () => boolean;
}

export const Kosmos = ({ disabled }: KosmosProps) => {
  const navigation: HomeNavigationProp = useNavigation();

  const onNavigateToKosmos = () => {
    sendFirebaseEvent(CustomAppEvents.main_kosmos);
    navigation.navigate('KosmosScreen');
  };

  return (
    <AccountActionButton
      Icon={({ color }) => <KosmosAccountActionIcon color={color} />}
      onPress={onNavigateToKosmos}
      text="Kosmos"
      isActive={disabled()}
    />
  );
};
