import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { AccountActionButton } from '@components/templates/AccountActions/components/ActionButton';
import { useBridgeContextData } from '@features/bridge/context';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { BridgeAccountActionIcon } from '@components/svg/icons/v2/actions';

interface BridgeProps {
  readonly disabled: () => boolean;
}

export const Bridge = ({ disabled }: BridgeProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { setDefaultBridgeData } = useBridgeContextData();

  const onNavigateToBridge = () => {
    setDefaultBridgeData();
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
