import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { HarborWithdrawTabs } from '@features/harbor/components/tabs';
import { useEffectOnce } from '@hooks';

export const WithdrawHarborScreen = () => {
  const { top } = useSafeAreaInsets();

  const { getClaimAmount, setDefaultActiveAmbTiers } = useHarborStore();
  const { wallet } = useWalletStore();
  useEffectOnce(() => {
    getClaimAmount(wallet?.address || '');
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDefaultActiveAmbTiers();
      };
    }, [setDefaultActiveAmbTiers])
  );

  return (
    <View style={{ paddingTop: top }}>
      <HarborWithdrawTabs />
    </View>
  );
};
