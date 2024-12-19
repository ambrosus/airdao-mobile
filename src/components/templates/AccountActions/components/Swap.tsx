import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { SwapAccountActionIcon } from '@components/svg/icons/v2/actions';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { AccountActionButton } from './ActionButton';

interface SwapActionProps {
  readonly disabled: () => boolean;
}

export const Swap = ({ disabled }: SwapActionProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToSwap = () => {
    sendFirebaseEvent(CustomAppEvents.main_swap);
    navigation.navigate('SwapScreen');
  };

  return (
    <AccountActionButton
      Icon={({ color }) => <SwapAccountActionIcon color={color} />}
      onPress={navigateToSwap}
      text={t('token.actions.swap')}
      isActive={disabled()}
    />
  );
};
