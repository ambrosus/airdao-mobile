import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { styles } from './styles';
import {
  MarketListItem,
  ScreenLoader
} from '@/features/kosmos/components/base';
import { FiltersState, MarketType } from '@features/kosmos/types';
import {
  useActiveMarkets,
  useClosedMarkets,
  useMarketTokens
} from '@features/kosmos/lib/hooks';
import { filter } from '@/features/kosmos/utils';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { HomeNavigationProp } from '@appTypes';

const ESTIMATED_ITEM_SIZE = 56;
const ESTIMATED_LIST_SIZE = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT };

interface ActiveMarketsListProps {
  filters: FiltersState;
}

export const MarketsList = ({ filters }: ActiveMarketsListProps) => {
  const navigation: HomeNavigationProp = useNavigation();
  const { tokens, isTokensLoading } = useMarketTokens();

  const { markets, refetchMarkets, isMarketsLoading } = useActiveMarkets();
  const { closedMarkets, isClosedMarketsLoading } = useClosedMarkets();

  const filteredMarkets = useMemo(() => {
    return filter(filters, markets, closedMarkets, tokens);
  }, [filters, markets, closedMarkets, tokens]);

  const renderMarketListItem = useCallback(
    (args: ListRenderItemInfo<MarketType>) => {
      const { item: market, index } = args;
      const redirectToDetails = () =>
        navigation.navigate('KosmosMarketScreen', { market });

      return (
        <TouchableOpacity onPress={redirectToDetails}>
          <MarketListItem index={index} market={market} />
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  const RenderListFooterComponent = useCallback(() => {
    return <View style={styles.listFooterComponent} />;
  }, []);

  const combinedLoadingState = useMemo(() => {
    return isClosedMarketsLoading || isMarketsLoading || isTokensLoading;
  }, [isClosedMarketsLoading, isMarketsLoading, isTokensLoading]);

  if (combinedLoadingState) {
    return <ScreenLoader />;
  }

  return (
    <FlashList
      keyExtractor={(item) => item.id}
      data={filteredMarkets}
      renderItem={renderMarketListItem}
      onRefresh={refetchMarkets}
      refreshing={isMarketsLoading}
      estimatedItemSize={ESTIMATED_ITEM_SIZE}
      estimatedListSize={ESTIMATED_LIST_SIZE}
      ListFooterComponent={RenderListFooterComponent}
      removeClippedSubviews
    />
  );
};
