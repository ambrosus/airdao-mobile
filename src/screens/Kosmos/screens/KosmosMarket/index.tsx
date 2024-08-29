import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  InteractionManager,
  LayoutChangeEvent,
  RefreshControl,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Header } from '@components/composite';
import {
  MarketHeaderDetails,
  ScreenLoader
} from '@features/kosmos/components/base';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { HomeParamsList } from '@appTypes';
import { useMarketByIdQuery } from '@features/kosmos/lib/query';
import { MarketTableDetails } from '@features/kosmos/components/composite';
import {
  ExactMarketTokenTabs,
  MarketChartsWithTimeframes
} from '@features/kosmos/components/templates';

type KosmosMarketScreenProps = NativeStackScreenProps<
  HomeParamsList,
  'KosmosMarketScreen'
>;

export const KosmosMarketScreen = ({ route }: KosmosMarketScreenProps) => {
  const {
    onToggleMarketTooltip,
    isExactMarketLoading,
    isBalanceFetching,
    reset
  } = useKosmosMarketsContextSelector();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const { token } = useExtractToken(route.params.market.payoutToken);

  const [marketLayoutYAxis, setMarketLayoutYAxis] = useState(0);

  const { market, refetch, isLoading } = useMarketByIdQuery(
    route.params.market.id
  );

  const renderHeaderMiddleContent = useMemo(() => {
    const tokenSymbol = token?.symbol ?? '';
    return <MarketHeaderDetails tokenSymbol={tokenSymbol} />;
  }, [token?.symbol]);

  const onScrollBeginDragHandler = useCallback(
    () =>
      InteractionManager.runAfterInteractions(() =>
        onToggleMarketTooltip(false)
      ),
    [onToggleMarketTooltip]
  );

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [reset])
  );

  const onHandlerMarketLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (marketLayoutYAxis === 0) {
        const { y } = event.nativeEvent.layout;
        setMarketLayoutYAxis(y);
      }
    },
    [marketLayoutYAxis]
  );

  const renderRefetchController = useMemo(
    () => (
      <RefreshControl
        onRefresh={refetch}
        refreshing={isExactMarketLoading}
        removeClippedSubviews
      />
    ),
    [isExactMarketLoading, refetch]
  );

  const onScrollToMarket = useCallback(
    () => scrollViewRef.current?.scrollToPosition(0, marketLayoutYAxis),
    [marketLayoutYAxis]
  );

  const combinedLoading = useMemo(() => {
    return isBalanceFetching || isExactMarketLoading || isLoading;
  }, [isBalanceFetching, isExactMarketLoading, isLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder backIconVisible title={renderHeaderMiddleContent} />

      <View style={styles.container}>
        {!market || combinedLoading ? (
          <View style={styles.loader}>
            <ScreenLoader height="100%" />
          </View>
        ) : (
          <KeyboardAwareScrollView
            overScrollMode="never"
            enableOnAndroid
            enableAutomaticScroll
            scrollToOverflowEnabled={false}
            nestedScrollEnabled
            extraHeight={300}
            onMomentumScrollBegin={onScrollBeginDragHandler}
            refreshControl={renderRefetchController}
          >
            <MarketTableDetails
              market={market}
              onHandlerMarketLayout={onHandlerMarketLayout}
            />
            <MarketChartsWithTimeframes
              market={market}
              onScrollToMarket={onScrollToMarket}
            />
            <ExactMarketTokenTabs market={market} />
          </KeyboardAwareScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
