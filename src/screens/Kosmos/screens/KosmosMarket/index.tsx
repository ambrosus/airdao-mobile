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
import { useBalance, useExtractToken } from '@features/kosmos/lib/hooks';
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
    isMarketChartLoading,
    isBalanceFetching,
    bnBalance,
    reset
  } = useKosmosMarketsContextSelector();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const { token } = useExtractToken(route.params.market.payoutToken);

  const [marketLayoutYAxis, setMarketLayoutYAxis] = useState(0);

  const { market, refetch, isLoading } = useMarketByIdQuery(
    route.params.market.id
  );

  const { refetchTokenBalance } = useBalance(market);

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

  const refetchMarketData = useCallback(() => {
    refetchTokenBalance();
    refetch();
  }, [refetch, refetchTokenBalance]);

  const renderRefetchController = useMemo(
    () => (
      <RefreshControl
        onRefresh={refetchMarketData}
        refreshing={isMarketChartLoading}
        removeClippedSubviews
      />
    ),
    [isMarketChartLoading, refetchMarketData]
  );

  const onScrollToMarket = useCallback(
    () => scrollViewRef.current?.scrollToPosition(0, marketLayoutYAxis),
    [marketLayoutYAxis]
  );

  const combinedLoading = useMemo(() => {
    return !bnBalance || isBalanceFetching || isMarketChartLoading || isLoading;
  }, [bnBalance, isBalanceFetching, isMarketChartLoading, isLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder backIconVisible title={renderHeaderMiddleContent} />

      <View style={styles.container}>
        {combinedLoading && (
          <View style={styles.loader}>
            <ScreenLoader height="100%" />
          </View>
        )}

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
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
            market={route.params.market}
            onScrollToMarket={onScrollToMarket}
          />
          <ExactMarketTokenTabs market={market} />
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};
