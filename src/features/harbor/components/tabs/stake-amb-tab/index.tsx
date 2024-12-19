import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { scale } from '@utils';
import { Spacer } from '@components/base';
import { styles } from './styles';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import {
  StakeInfoContainer,
  TiersInfoContainer
} from '@features/harbor/components/base';

export const StakeAMBTab = ({}) => {
  const { data: harborData, loading, updateAll } = useHarborStore();
  const { wallet } = useWalletStore();

  const renderRefetchController = useMemo(() => {
    return (
      <RefreshControl
        onRefresh={() => updateAll(wallet?.address || '')}
        refreshing={false}
        removeClippedSubviews
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address]);

  return (
    <View>
      <ScrollView
        refreshControl={renderRefetchController}
        style={styles.wrapper}
      >
        <StakeInfoContainer harborData={harborData} loading={loading} />
        <Spacer value={scale(15)} />
        <TiersInfoContainer />
      </ScrollView>
    </View>
  );
};
