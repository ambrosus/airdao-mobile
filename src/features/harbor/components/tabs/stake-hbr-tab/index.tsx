import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Spacer, Spinner } from '@components/base';
import { useStakeHBRStore } from '@entities/harbor';
import { Rewards } from '@entities/harbor/components/composite';
import { StakeAMBWithApyLabel } from '@entities/harbor/components/modular';
import { useWalletStore } from '@entities/wallet';
import { StakedHBRContainerWithRedirect } from '@features/harbor/components/templates';
import { verticalScale } from '@utils';
import { styles } from './styles';

export const StakeHBRTab = ({}) => {
  const { wallet } = useWalletStore();
  const { loading, refreshing, hbrYieldFetcher } = useStakeHBRStore();

  const refreshControlNode = useMemo(() => {
    const onRefresh = () =>
      hbrYieldFetcher(wallet?.address ?? '', 'refreshing');

    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        removeClippedSubviews
      />
    );
  }, [hbrYieldFetcher, refreshing, wallet?.address]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={refreshControlNode}
        scrollToOverflowEnabled
        overScrollMode="auto"
        keyboardShouldPersistTaps="handled"
        style={styles.scrollViewContainer}
      >
        <Rewards />
        <StakedHBRContainerWithRedirect />
        <Spacer value={verticalScale(12)} />
        <StakeAMBWithApyLabel />
      </ScrollView>
    </View>
  );
};
