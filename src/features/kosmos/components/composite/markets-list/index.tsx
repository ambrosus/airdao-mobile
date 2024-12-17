import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import {
  MarketListItem,
  ScreenLoader
} from '@/features/kosmos/components/base';
import {
  FiltersState,
  MarketType,
  useActiveMarketsQuery,
  useClosedMarketsQuery,
  useMarketTokens
} from '@entities/kosmos';
import { filter } from '@/features/kosmos/utils';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from '@constants/variables';
import { HomeNavigationProp } from '@appTypes';

import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';

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
      const redirectToDetails = () => {
        sendFirebaseEvent(CustomAppEvents.kosmos_market_open);
        navigation.navigate('KosmosMarketScreen', { market });
      };

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
