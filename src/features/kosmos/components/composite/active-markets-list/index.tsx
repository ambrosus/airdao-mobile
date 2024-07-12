import React, { useCallback, useMemo } from 'react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { MarketListItem } from '@/features/kosmos/components/base';
import { FiltersState, MarketType } from '@features/kosmos/types';
import { useActiveMarkets } from '@features/kosmos/lib/hooks';
import { filter } from '@/features/kosmos/utils/filter';

const ESTIMATED_ITEM_SIZE = 56;

interface ActiveMarketsListProps {
  filters: FiltersState;
}

export const ActiveMarketsList = ({ filters }: ActiveMarketsListProps) => {
  const { markets, tokens, refetchMarkets, isMarketsLoading } =
    useActiveMarkets();

  const filteredMarkets = useMemo(() => {
    return filter(filters, markets);
  }, [filters, markets]);

  const renderMarketListItem = useCallback(
    (args: ListRenderItemInfo<MarketType>) => {
      return <MarketListItem market={args.item} tokens={tokens} />;
    },
    [tokens]
  );

  return (
    <FlashList
      keyExtractor={(item) => item.id}
      data={filteredMarkets}
      renderItem={renderMarketListItem}
      onRefresh={refetchMarkets}
      refreshing={isMarketsLoading}
      estimatedItemSize={ESTIMATED_ITEM_SIZE}
      removeClippedSubviews
    />
  );
};
