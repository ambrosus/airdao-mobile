import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { StakeInfoContainer, TiersInfoContainer } from './components';
import { scale } from '@utils/scaling';
import { Spacer } from '@components/base';
import { styles } from './styles';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';

export const StakeAMBTab = ({}) => {
  const { updateAll } = useHarborStore();
  const { wallet } = useWalletStore();

  const renderRefetchController = useMemo(() => {
    return (
      <RefreshControl
        onRefresh={() => updateAll(wallet?.address || '')}
        refreshing={false}
        removeClippedSubviews
      />
    );
  }, [updateAll, wallet?.address]);

  return (
    <View style={styles.main}>
      <ScrollView
        refreshControl={renderRefetchController}
        style={styles.wrapper}
      >
        <StakeInfoContainer />
        <Spacer value={scale(15)} />
        <TiersInfoContainer />
      </ScrollView>
    </View>
  );
};
