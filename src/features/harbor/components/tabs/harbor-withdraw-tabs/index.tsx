import React from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HarborNavigationProp } from '@appTypes/navigation/harbor';
import { Button } from '@components/base';
import { WrappedListsContainer } from '@components/base/wrapped-lists-container';
import { Header } from '@components/composite';
import { AutoScrollBox } from '@components/modular';
import { AnimatedTabsV2 } from '@components/modular/AnimatedTabsV2';
import { NoteIcon } from '@components/svg/icons/v2/harbor';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { WithdrawRewardOnlyTab } from '../withdraw-reward-only-tab';
import { WithdrawStakeRewardTab } from '../withdraw-stake-reward-tab';

export const HarborWithdrawTabs = () => {
  const { t } = useTranslation();
  const { wallet } = useWalletStore();
  const navigation = useNavigation<HarborNavigationProp>();
  const { updateAll, loading } = useHarborStore();
  const refetchAll = async () => {
    updateAll(wallet?.address || '');
  };

  const RightContent = () => (
    <Button onPress={() => navigation.navigate('WithdrawRequests')}>
      <NoteIcon />
    </Button>
  );
  return (
    <AutoScrollBox
      header={
        <Header
          title={`${t('harbor.withdraw.header')} AMB`}
          contentRight={<RightContent />}
        />
      }
      refreshControl={
        <RefreshControl
          onRefresh={refetchAll}
          refreshing={loading}
          removeClippedSubviews
        />
      }
    >
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
    </AutoScrollBox>
  );
};
