import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { styles } from './styles';
import { MarketListItem } from '@/features/kosmos/components/base';
import { FiltersState, MarketType } from '@features/kosmos/types';
import {
  useActiveMarkets,
  useClosedMarkets,
  useMarketsTokens
} from '@features/kosmos/lib/hooks';
import { filter } from '@/features/kosmos/utils/filter';
import { Spinner } from '@components/base';
import { DEVICE_WIDTH } from '@constants/variables';

const ESTIMATED_ITEM_SIZE = 56;

interface ActiveMarketsListProps {
  filters: FiltersState;
}

export const MarketsList = ({ filters }: ActiveMarketsListProps) => {
  const { tokens, isTokensLoading } = useMarketsTokens();
  const { markets, refetchMarkets, isMarketsLoading } = useActiveMarkets();
  const { closedMarkets, isClosedMarketsLoading } = useClosedMarkets();

  const filteredMarkets = useMemo(() => {
    return filter(filters, markets, closedMarkets, tokens);
  }, [filters, markets, closedMarkets, tokens]);

  const renderMarketListItem = useCallback(
    (args: ListRenderItemInfo<MarketType>) => {
      return (
        <TouchableOpacity>
          <MarketListItem
            index={args.index}
            market={args.item}
            tokens={tokens}
          />
        </TouchableOpacity>
      );
    },
    [tokens]
  );

  const RenderListFooterComponent = useCallback(() => {
    return <View style={styles.listFooterComponent} />;
  }, []);

  const combinedLoadingState = useMemo(() => {
    return isClosedMarketsLoading || isMarketsLoading || isTokensLoading;
  }, [isClosedMarketsLoading, isMarketsLoading, isTokensLoading]);

  if (combinedLoadingState) {
    return (
      <View style={styles.loader}>
        <Spinner />
      </View>
    );
  }

  return (
    <FlashList
      keyExtractor={(item) => item.id}
      data={filteredMarkets}
      renderItem={renderMarketListItem}
      onRefresh={refetchMarkets}
      refreshing={isMarketsLoading}
      estimatedItemSize={ESTIMATED_ITEM_SIZE}
      estimatedListSize={{ width: DEVICE_WIDTH, height: 40 }}
      ListFooterComponent={RenderListFooterComponent}
      removeClippedSubviews
    />
  );
};
