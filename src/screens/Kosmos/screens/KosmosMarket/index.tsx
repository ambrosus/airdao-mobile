import React, { useMemo } from 'react';
import { SafeAreaView, ViewStyle, StyleProp } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '@components/composite';
import { MarketHeaderDetails } from '@features/kosmos/components/base';
import { MarketTableDetails } from '@features/kosmos/components/composite';
import {
  ExactMarketTokenTabs,
  MarketChartsWithTimeframes
} from '@features/kosmos/components/templates';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { HomeParamsList } from '@appTypes';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { KeyboardDismissingView } from '@components/base';

type KosmosMarketScreenProps = NativeStackScreenProps<
  HomeParamsList,
  'KosmosMarketScreen'
>;

export const KosmosMarketScreen = ({ route }: KosmosMarketScreenProps) => {
  const { onToggleMarketTooltip } = useKosmosMarketsContextSelector();
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

  return (
    <SafeAreaView style={screenWrapperStyle}>
      <Header bottomBorder backIconVisible title={renderHeaderMiddleContent} />

      <KeyboardAwareScrollView
        scrollEventThrottle={32}
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDragHandler}
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        extraHeight={300}
      >
        <KeyboardDismissingView>
          <MarketTableDetails market={route.params.market} />
          <MarketChartsWithTimeframes market={route.params.market} />
          <ExactMarketTokenTabs market={route.params.market} />
        </KeyboardDismissingView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
