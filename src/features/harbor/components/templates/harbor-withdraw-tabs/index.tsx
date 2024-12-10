import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedTabsV2 } from '@components/modular/AnimatedTabsV2';
import { WrappedListsContainer } from '@features/kosmos/components/base';
import { WithdrawRewardOnlyTab } from '@features/harbor/components/composite/withdraw-reward-only-tab';
import { WithdrawStakeRewardTab } from '@features/harbor/components/composite/withdraw-stake-reward-tab';

export const HarborWithdrawTabs = () => {
  const { t } = useTranslation();
  return (
    <AnimatedTabsV2
      dismissOnChangeIndex
      keyboardShouldPersistTaps="handled"
      containerStyle={{ height: '100%' }}
      tabs={[
        {
          title: t('harbor.withdraw.stake.reward'),
          view: (
            <WrappedListsContainer>
              <WithdrawStakeRewardTab />
            </WrappedListsContainer>
          )
        },
        {
          title: t('harbor.withdraw.reward'),
          view: (
            <WrappedListsContainer>
              <WithdrawRewardOnlyTab />
            </WrappedListsContainer>
          )
        }
      ]}
    />
  );
};
