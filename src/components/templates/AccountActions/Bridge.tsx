import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { AccountActionButton } from '@components/templates/AccountActions/ActionButton';
import { BridgeIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountDBModel } from '@database';
import { useBridgeContextSelector } from '@contexts/Bridge';

export const Bridge = ({
  selectedAccount
}: {
  selectedAccount: AccountDBModel | null;
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const { setSelectedAccountHash } = useBridgeContextSelector();

  const onNavigateToBridge = () => {
    navigation.navigate('Bridge');
    setSelectedAccountHash(selectedAccount?._raw.hash);
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
