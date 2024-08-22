import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ViewStyle,
  StyleProp,
  View,
  LayoutChangeEvent,
  RefreshControl,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { Header } from '@components/composite';
import {
  MarketHeaderDetails,
  ScreenLoader
} from '@features/kosmos/components/base';
import { MarketTableDetails } from '@features/kosmos/components/composite';
import {
  ExactMarketTokenTabs,
  MarketChartsWithTimeframes
} from '@features/kosmos/components/templates';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { useExtractToken, useMarketDetails } from '@features/kosmos/lib/hooks';
import { HomeParamsList } from '@appTypes';
import { SafeAreaView } from 'react-native-safe-area-context';

type KosmosMarketScreenProps = NativeStackScreenProps<
  HomeParamsList,
  'KosmosMarketScreen'
>;

export const KosmosMarketScreen = ({
  navigation,
  route
}: KosmosMarketScreenProps) => {
  const {
    onToggleMarketTooltip,
    isExactMarketLoading,
    isBalanceFetching,
    reset
  } = useKosmosMarketsContextSelector();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const { token } = useExtractToken(route.params.market.payoutToken);
  const { fetchMarketById } = useMarketDetails(route.params.market);

  const [marketLayoutYAxis, setMarketLayoutYAxis] = useState(0);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const screenWrapperStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      flex: 1
    };
  }, []);

  const renderHeaderMiddleContent = useMemo(() => {
    const tokenSymbol = token?.symbol ?? '';
    return <MarketHeaderDetails tokenSymbol={tokenSymbol} />;
  }, [token?.symbol]);

  const onScrollBeginDragHandler = () => onToggleMarketTooltip(false);

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
  const onPullToRefreshMarket = useCallback(async () => {
    const response = await fetchMarketById();

    if (response) {
      navigation.setParams({ market: response.data });
    }
  }, [fetchMarketById, navigation]);

  const renderRefetchController = useMemo(
    () => (
      <RefreshControl
        onRefresh={onPullToRefreshMarket}
        refreshing={isExactMarketLoading}
        removeClippedSubviews
      />
    ),
    [isExactMarketLoading, onPullToRefreshMarket]
  );

  const onScrollToMarket = useCallback(
    () => scrollViewRef.current?.scrollToPosition(0, marketLayoutYAxis),
    [marketLayoutYAxis]
  );

  const onScrollToBuyBondsField = useCallback(() => {
    scrollViewRef.current?.scrollToPosition(0, 0, true);
  }, []);

  const combinedLoading = useMemo(() => {
    return isBalanceFetching || isExactMarketLoading;
  }, [isBalanceFetching, isExactMarketLoading]);

  const onTabsSwipeStateHandle = useCallback(
    (state: boolean) => setIsScrollEnabled(!state),
    []
  );

  return (
    <SafeAreaView style={screenWrapperStyle}>
      <Header bottomBorder backIconVisible title={renderHeaderMiddleContent} />

      <View style={styles.container}>
        {combinedLoading && (
          <View style={styles.loader}>
            <ScreenLoader height="100%" />
          </View>
        )}

        <KeyboardAwareScrollView
          ref={scrollViewRef}
          enableOnAndroid
          enableAutomaticScroll
          refreshControl={renderRefetchController}
          scrollEnabled={isScrollEnabled}
          scrollEventThrottle={32}
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={onScrollBeginDragHandler}
          scrollToOverflowEnabled={false}
          extraHeight={Platform.select({ android: 220, ios: 300 })}
        >
          <MarketTableDetails
            market={route.params.market}
            onHandlerMarketLayout={onHandlerMarketLayout}
          />
          <MarketChartsWithTimeframes
            market={route.params.market}
            onScrollToMarket={onScrollToMarket}
          />
          <ExactMarketTokenTabs
            market={route.params.market}
            onScrollToBuyBondsField={onScrollToBuyBondsField}
            onTabsSwipeStateHandle={onTabsSwipeStateHandle}
          />
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};
