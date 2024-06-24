import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { AccountActionButton } from '@components/templates/AccountActions/ActionButton';
import { BridgeIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { useBridgeContextData } from '@contexts/Bridge';

export const Bridge = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();
  const { setDefaultBridgeData } = useBridgeContextData();
  const onNavigateToBridge = () => {
    setDefaultBridgeData();
    navigation.navigate('Bridge');
  };

  return (
    <AccountActionButton
      Icon={BridgeIcon}
      onPress={onNavigateToBridge}
      text={t('account.actions.bridge')}
      isActive={Config.walletActions.bridge}
    />
  );
};
