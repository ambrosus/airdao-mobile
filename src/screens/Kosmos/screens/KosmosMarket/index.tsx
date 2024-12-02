import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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
import { DEVICE_HEIGHT } from '@constants/variables';
import { Spacer } from '@components/base';
import { verticalScale } from '@utils/scaling';

type KosmosMarketScreenProps = NativeStackScreenProps<
  HomeParamsList,
  'KosmosMarketScreen'
>;

export const KosmosMarketScreen = ({ route }: KosmosMarketScreenProps) => {
  const { onToggleMarketTooltip, isMarketChartLoading, reset } =
    useKosmosMarketsContextSelector();

  const { token } = useExtractToken(route.params.market.payoutToken);
  const [marketLayoutYAxis, setMarketLayoutYAxis] = useState(0);
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [userPerformedRefresh, setUserPerformedRefresh] = useState(false);
  const [buyBondsLayoutMeasureHeight, setBuyBondsLayoutMeasureHeight] =
    useState(0);

  const { market, refetch, isRefetching, isLoading } = useMarketByIdQuery(
    route.params.market.id
  );

  const { calculateMaximumAvailableAmount } = useBalance(market);

  const { refetch: refetchTransactions, isLoading: isLoadingTransaction } =
    useMarketTransactions(market?.id);

  const scrollRef = useRef<KeyboardAwareScrollView>(null);

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

  const onRefetchMarketDetails = useCallback(async () => {
    setUserPerformedRefresh(true);
    try {
      if (isAndroid) {
        await refetchTransactions();
      }

      await refetch();
    } catch (error) {
      throw error;
    }
  }, [refetch, refetchTransactions]);

  useEffect(() => {
    if (!isRefetching) setUserPerformedRefresh(false);
  }, [isRefetching]);

  useUpdateScreenData(onRefetchMarketDetails, 600);

  const onRefetchMarketHandle = useCallback(async () => {
    const refreshKosmosTransactions = async () => {
      setIsRefreshingData(true);
      try {
        await onRefetchMarketDetails();
      } finally {
        setIsRefreshingData(false);
      }
    };
    await refreshKosmosTransactions();
  }, [onRefetchMarketDetails]);

  const onHandleBuyBondsLayoutChange = useCallback(
    (event: LayoutChangeEvent) => {
      setBuyBondsLayoutMeasureHeight(
        DEVICE_HEIGHT / 2 - event.nativeEvent.layout.height
      );
    },
    []
  );

  const renderRefetchController = useMemo(() => {
    const refreshing =
      isMarketChartLoading || (isAndroid && isLoadingTransaction);
    return (
      <RefreshControl
        onRefresh={onRefetchMarketHandle}
        refreshing={refreshing}
        removeClippedSubviews
      />
    );
  }, [isMarketChartLoading, isLoadingTransaction, onRefetchMarketHandle]);

  const onScrollToMarket = useCallback(() => {
    if (!isAndroid) {
      scrollRef.current?.scrollToPosition(0, buyBondsLayoutMeasureHeight, true);
    }
  }, [buyBondsLayoutMeasureHeight]);

  const combinedLoading = useMemo(() => {
    return isMarketChartLoading || isLoading;
  }, [isMarketChartLoading, isLoading]);

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
            enableOnAndroid
            enableAutomaticScroll
            scrollToOverflowEnabled={false}
            nestedScrollEnabled={isIOS}
            extraHeight={330}
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
              onHandleBuyBondsLayoutChange={onHandleBuyBondsLayoutChange}
              userPerformedRefresh={userPerformedRefresh}
              calculateMaximumAvailableAmount={calculateMaximumAvailableAmount}
              market={market}
              scrollToInput={scrollToInput}
              onScrollToTop={onScrollToMarket}
            />
            <Spacer value={verticalScale(30)} />
          </KeyboardAwareScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
