import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { AccountActionButton } from '@components/templates/AccountActions/components/ActionButton';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { BridgeAccountActionIcon } from '@components/svg/icons/v2/actions';

interface BridgeProps {
  readonly disabled: () => boolean;
}

export const Bridge = ({ disabled }: BridgeProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const onNavigateToBridge = () => {
    sendFirebaseEvent(CustomAppEvents.main_bridge);
    navigation.navigate('Bridge');
  };

  return (
    <AccountActionButton
      Icon={({ color }) => <BridgeAccountActionIcon color={color} />}
      onPress={onNavigateToBridge}
      text={t('account.actions.bridge')}
      isActive={disabled()}
    />
  );
};
