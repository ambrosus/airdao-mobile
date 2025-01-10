import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HomeNavigationProp } from '@appTypes';
import { StakeAccountActionIcon } from '@components/svg/icons/v2/actions';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { AccountActionButton } from './ActionButton';

interface StakingProps {
  readonly disabled: () => boolean;
}

export const Staking = ({ disabled }: StakingProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeNavigationProp>();

  const navigateToStakingPools = () => {
    sendFirebaseEvent(CustomAppEvents.main_stake);
    navigation.navigate('Harbor');
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
