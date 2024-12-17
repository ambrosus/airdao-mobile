import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountActionButton } from './ActionButton';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { StakeAccountActionIcon } from '@components/svg/icons/v2/actions';

interface StakingProps {
  readonly disabled: () => boolean;
}

export const Staking = ({ disabled }: StakingProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToStakingPools = () => {
    sendFirebaseEvent(CustomAppEvents.main_stake);
    navigation.navigate('StakingPools');
  };

  return (
    <AccountActionButton
      Icon={({ color }) => <StakeAccountActionIcon color={color} />}
      onPress={navigateToStakingPools}
      text={t('account.actions.stake')}
      isActive={disabled()}
    />
  );
};
