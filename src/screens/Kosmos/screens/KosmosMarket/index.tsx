import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, ViewStyle, StyleProp } from 'react-native';
import { Header } from '@components/composite';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MarketHeaderDetails } from '@features/kosmos/components/base';
import { MarketTableDetails } from '@features/kosmos/components/composite';
import { MarketChartsWithTimeframes } from '@features/kosmos/components/templates';
import { useExtractToken } from '@features/kosmos/lib/hooks';
import { HomeParamsList } from '@appTypes';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

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

      <ScrollView
        scrollEventThrottle={32}
        onScrollBeginDrag={onScrollBeginDragHandler}
      >
        <MarketTableDetails market={route.params.market} />
        <MarketChartsWithTimeframes market={route.params.market} />
      </ScrollView>
    </SafeAreaView>
  );
};
