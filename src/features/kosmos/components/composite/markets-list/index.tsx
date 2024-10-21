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
import { useMarketTokens } from '@features/kosmos/lib/hooks';
import { filter } from '@/features/kosmos/utils';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { HomeNavigationProp } from '@appTypes';
import {
  useActiveMarketsQuery,
  useClosedMarketsQuery
} from '@features/kosmos/lib/query';
import { useTranslation } from 'react-i18next';

const ESTIMATED_ITEM_SIZE = 56;
const ESTIMATED_LIST_SIZE = { width: DEVICE_WIDTH, height: DEVICE_HEIGHT };

interface ActiveMarketsListProps {
  filters: FiltersState;
}

export const MarketsList = ({ filters }: ActiveMarketsListProps) => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();

  const { tokens, isTokensLoading } = useMarketTokens();

  const {
    markets,
    isLoading: isMarketsLoading,
    refetchActiveMarkets
  } = useActiveMarketsQuery(filters);
  const {
    closedMarkets,
    isLoading: isClosedMarketsLoading,
    refetchClosedMarkets
  } = useClosedMarketsQuery(filters);

  const filteredMarkets = useMemo(() => {
    return filter(
      filters,
      markets as MarketType[],
      closedMarkets as MarketType[],
      tokens
    ).reverse();
  }, [filters, markets, closedMarkets, tokens]);

  const renderMarketListItem = useCallback(
    (args: ListRenderItemInfo<MarketType>) => {
      const { item: market } = args;
      const redirectToDetails = () =>
        navigation.navigate('KosmosMarketScreen', { market });

      return (
        <TouchableOpacity onPress={redirectToDetails}>
          <MarketListItem market={market} />
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

  const refetchMarkets = useCallback(() => {
    switch (filters.status) {
      case t('kosmos.status.active'):
        return refetchActiveMarkets();
      case t('kosmos.status.closed'):
        return refetchClosedMarkets();
      case t('kosmos.status.all'):
        return Promise.all([refetchActiveMarkets(), refetchClosedMarkets()]);
    }
  }, [filters.status, refetchActiveMarkets, refetchClosedMarkets, t]);

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
