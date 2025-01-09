import React, { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Spacer, Spinner } from '@components/base';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useAvailableWithdrawLogs, useStakeHBRStore } from '@entities/harbor';
import { Rewards } from '@entities/harbor/components/composite';
import { StakeAMBWithApyLabel } from '@entities/harbor/components/modular';
import { useWalletStore } from '@entities/wallet';
import { StakedHBRContainerWithRedirect } from '@features/harbor/components/templates';
import { isSmallScreen, verticalScale } from '@utils';
import { styles } from './styles';

export const StakeHBRTab = ({}) => {
  const { wallet } = useWalletStore();
  const { loading, refreshing, hbrYieldFetcher, limitsConfig } =
    useStakeHBRStore();

  const { logs, refetchLogs } = useAvailableWithdrawLogs(
    limitsConfig.stakeLockPeriod
  );

  useFocusEffect(
    useCallback(() => {
      refetchLogs();
    }, [refetchLogs])
  );

  const scrollViewContentStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      paddingBottom: isSmallScreen ? DEVICE_HEIGHT / 3.25 : 0
    }),
    []
  );

  const refreshControlNode = useMemo(() => {
    const onRefresh = () => {
      hbrYieldFetcher(wallet?.address ?? '', 'refreshing');
      refetchLogs();
    };

    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        removeClippedSubviews
      />
    );
  }, [hbrYieldFetcher, refetchLogs, refreshing, wallet?.address]);

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
        contentContainerStyle={scrollViewContentStyle}
      >
        <Rewards />
        <StakedHBRContainerWithRedirect />
        <Spacer value={verticalScale(12)} />
        <StakeAMBWithApyLabel logs={logs} />
      </ScrollView>
    </View>
  );
};
