import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { AccountActionButton } from './ActionButton';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { SwapAccountActionIcon } from '@components/svg/icons/v2/actions';

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
