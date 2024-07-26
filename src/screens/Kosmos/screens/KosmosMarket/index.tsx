import React, { useCallback, useMemo } from 'react';
import { SafeAreaView, ViewStyle, StyleProp, View } from 'react-native';
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
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { HomeParamsList } from '@appTypes';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

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
  const { token } = useExtractToken(route.params.market.payoutToken);

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

  const combinedLoading = useMemo(() => {
    return isBalanceFetching || isExactMarketLoading;
  }, [isBalanceFetching, isExactMarketLoading]);

  return (
    <SafeAreaView style={screenWrapperStyle}>
      <Header bottomBorder backIconVisible title={renderHeaderMiddleContent} />

      {combinedLoading && (
        <View style={styles.loader}>
          <ScreenLoader height="90%" />
        </View>
      )}

      <KeyboardAwareScrollView
        enableOnAndroid
        scrollEventThrottle={32}
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={onScrollBeginDragHandler}
        scrollToOverflowEnabled={false}
        extraHeight={300}
      >
        <MarketTableDetails market={route.params.market} />
        <MarketChartsWithTimeframes market={route.params.market} />
        <ExactMarketTokenTabs market={route.params.market} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
