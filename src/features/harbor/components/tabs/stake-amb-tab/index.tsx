import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Spacer } from '@components/base';
import { useHarborStore } from '@entities/harbor/model';
import { useWalletStore } from '@entities/wallet';
import { StakeInfoContainer } from '@features/harbor/components/base';
import { scale } from '@utils';
import { styles } from './styles';

export const StakeAMBTab = () => {
  const scrollRef = useRef<ScrollView>(null);
  const { data: harborData, loading, updateAll } = useHarborStore();
  const { wallet } = useWalletStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const handleRefresh = useCallback(() => {
    if (wallet?.address) {
      updateAll(wallet.address);
    }
  }, [wallet?.address, updateAll]);

  useEffect(() => {
    if (wallet?.address && !isInitialized) {
      handleRefresh();
      setIsInitialized(true);
    }
  }, [wallet?.address, handleRefresh, isInitialized]);

  const renderRefetchController = useMemo(() => {
    return (
      <RefreshControl
        onRefresh={handleRefresh}
        refreshing={false}
        removeClippedSubviews
      />
    );
  }, [handleRefresh]);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        refreshControl={renderRefetchController}
        style={styles.wrapper}
      >
        <StakeInfoContainer harborData={harborData} loading={loading} />
        <Spacer value={scale(15)} />
      </ScrollView>
    </View>
  );
};
