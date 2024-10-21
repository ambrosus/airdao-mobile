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
import {
  useMarketByIdQuery,
  useMarketTransactions
} from '@features/kosmos/lib/query';
import { MarketTableDetails } from '@features/kosmos/components/composite';
import {
  ExactMarketTokenTabs,
  MarketChartsWithTimeframes
} from '@features/kosmos/components/templates';
import { isIOS } from 'react-native-popover-view/dist/Constants';
import { isAndroid } from '@utils/isPlatform';
import { useUpdateScreenData } from '@hooks/useUpdateScreenData';

type KosmosMarketScreenProps = NativeStackScreenProps<
  HomeParamsList,
  'KosmosMarketScreen'
>;

export const KosmosMarketScreen = ({ route }: KosmosMarketScreenProps) => {
  const { onToggleMarketTooltip, isMarketChartLoading, reset } =
    useKosmosMarketsContextSelector();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const { token } = useExtractToken(route.params.market.payoutToken);
  const [marketLayoutYAxis, setMarketLayoutYAxis] = useState(0);
  const [isRefreshingData, setIsRefreshingData] = useState(false);

  const { market, refetch, isLoading } = useMarketByIdQuery(
    route.params.market.id
  );

  const {
    calculateMaximumAvailableAmount,
    isFetching: isFetchingBalance,
    tokenBalance,
    refetchTokenBalance
  } = useBalance(market);

  const { refetch: refetchTransactions, isLoading: isLoadingTransaction } =
    useMarketTransactions(market?.id);

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

  const refreshData = useCallback(async () => {
    try {
      if (isAndroid) {
        await refetchTransactions();
      }
      refetchTokenBalance();
      await refetch();
    } catch (e) {
      // ignore
    }
  }, [refetch, refetchTokenBalance, refetchTransactions]);

  useUpdateScreenData(refreshData, 600);

  const refetchMarketData = useCallback(async () => {
    const refreshKosmosTransactions = async () => {
      setIsRefreshingData(true);
      try {
        await refreshData();
      } finally {
        setIsRefreshingData(false);
      }
    };
    await refreshKosmosTransactions();
  }, [refreshData]);

  const renderRefetchController = useMemo(() => {
    const refreshing =
      isMarketChartLoading || (isAndroid && isLoadingTransaction);
    return (
      <RefreshControl
        onRefresh={refetchMarketData}
        refreshing={refreshing}
        removeClippedSubviews
      />
    );
  }, [isMarketChartLoading, isLoadingTransaction, refetchMarketData]);

  const onScrollToMarket = useCallback(
    () => scrollViewRef.current?.scrollToPosition(0, marketLayoutYAxis),
    [marketLayoutYAxis]
  );

  const combinedLoading = useMemo(() => {
    return isMarketChartLoading || isLoading;
  }, [isMarketChartLoading, isLoading]);
  const scrollRef = useRef(null);
  const scrollToInput = () =>
    // @ts-ignore
    scrollRef?.current?.scrollToEnd({ animated: true });

  return (
    <SafeAreaView style={styles.container}>
      <Header bottomBorder backIconVisible title={renderHeaderMiddleContent} />

      <View style={styles.container}>
        {!isRefreshingData && combinedLoading ? (
          <View style={styles.loader}>
            <ScreenLoader height="100%" />
          </View>
        ) : (
          <KeyboardAwareScrollView
            ref={scrollRef}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps="handled"
            overScrollMode="never"
            enableOnAndroid={false}
            enableAutomaticScroll
            scrollToOverflowEnabled={false}
            nestedScrollEnabled={isIOS}
            extraHeight={isAndroid ? 0 : 300}
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
            <ExactMarketTokenTabs
              calculateMaximumAvailableAmount={calculateMaximumAvailableAmount}
              tokenBalance={tokenBalance}
              isFetchingBalance={isFetchingBalance}
              market={market}
              scrollToInput={scrollToInput}
            />
          </KeyboardAwareScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
