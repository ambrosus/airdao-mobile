import React, { useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Spacer } from '@components/base';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import {
  StakeInfoContainer,
  TiersInfoContainer
} from '@features/harbor/components/base';
import { scale, isSmallScreen } from '@utils';
import { styles } from './styles';

export const StakeAMBTab = () => {
  const scrollRef = useRef<ScrollView>(null);
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

  const [extraHeight, setExtraHeight] = useState(50);

  const onScrollTo = (value: number) => {
    if (isSmallScreen) {
      scrollRef.current?.scrollTo({ y: value, animated: true });
    }
  };

  const onToggleTiers = (event?: string) => {
    switch (event) {
      case 'open':
        setExtraHeight(400);
        onScrollTo(extraHeight);
        break;
      default:
        setExtraHeight(50);
        onScrollTo(0);
        break;
    }
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        refreshControl={renderRefetchController}
        style={styles.wrapper}
      >
        <StakeInfoContainer harborData={harborData} loading={loading} />
        <Spacer value={scale(15)} />
        <TiersInfoContainer onToggleTiers={onToggleTiers} />
        <Spacer value={extraHeight} />
      </ScrollView>
    </View>
  );
};
