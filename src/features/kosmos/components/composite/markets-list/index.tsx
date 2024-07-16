import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { HomeNavigationProp } from '@appTypes';

const ESTIMATED_ITEM_SIZE = 56;
const ESTIMATED_LIST_SIZE = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT };

interface ActiveMarketsListProps {
  filters: FiltersState;
}

export const MarketsList = ({ filters }: ActiveMarketsListProps) => {
  const navigation: HomeNavigationProp = useNavigation();
  const { tokens, isTokensLoading } = useMarketsTokens();
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
          <MarketListItem index={index} market={market} tokens={tokens} />
        </TouchableOpacity>
      );
    },
    [navigation, tokens]
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
      estimatedListSize={ESTIMATED_LIST_SIZE}
      ListFooterComponent={RenderListFooterComponent}
      removeClippedSubviews
    />
  );
};
