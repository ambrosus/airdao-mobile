import React, { useCallback, useMemo, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { MarketChart } from '../../modular';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { ChartTimeIntervals } from '../../composite';
import { CHART_INTERVALS } from '@features/kosmos/constants';
import { verticalScale } from '@utils/scaling';

interface MarketChartsWithTimeframesProps {
  market: MarketType;
}

export const MarketChartsWithTimeframes = ({
  market
}: MarketChartsWithTimeframesProps) => {
  const { quoteToken } = useMarketDetails(market);
  const [chartInterval, setChartInterval] = useState(CHART_INTERVALS[2].value);

  const onChangeInterval = useCallback(
    (interval: number) => setChartInterval(interval),
    []
  );

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      marginTop: verticalScale(32)
    };
  }, []);

  return (
    <View style={containerStyle}>
      <MarketChart
        market={market}
        chartInterval={chartInterval}
        tokenAddress={market.payoutToken}
        fpaPrice={market.marketType === 'FPA' ? market.askingPrice : null}
        marketId={market.id}
        marketStart={market.start}
        quotePrice={quoteToken?.price}
        askingPrice={market.askingPrice}
      />

      <ChartTimeIntervals
        onChangeInterval={onChangeInterval}
        chartInterval={chartInterval}
      />
    </View>
  );
};
