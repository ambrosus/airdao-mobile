import React from 'react';
import { useTranslation } from 'react-i18next';
import { StakeRocketIcon } from '@components/svg/icons';
import Config from '@constants/config';
import { AccountActionButton } from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';

export const Staking = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToStakingPools = () => {
    sendFirebaseEvent(CustomAppEvents.main_stake);
    navigation.navigate('StakingPools');
  };

  return (
    <AccountActionButton
      Icon={StakeRocketIcon}
      onPress={navigateToStakingPools}
      text={t('account.actions.stake')}
      isActive={Config.walletActions.stake}
    />
  );
};
