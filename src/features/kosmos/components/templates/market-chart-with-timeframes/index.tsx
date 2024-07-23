import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { styles } from './styles';
import { MarketChart } from '@features/kosmos/components/modular';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { ChartTimeIntervals } from '@features/kosmos/components/composite';
import { CHART_INTERVALS } from '@features/kosmos/constants';
import { verticalScale } from '@utils/scaling';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

interface MarketChartsWithTimeframesProps {
  market: MarketType;
}

export const MarketChartsWithTimeframes = ({
  market
}: MarketChartsWithTimeframesProps) => {
  const { onToggleMarketTooltip } = useKosmosMarketsContextSelector();
  const { quoteToken } = useMarketDetails(market);
  const [chartInterval, setChartInterval] = useState(CHART_INTERVALS[2].value);

  const onChangeInterval = useCallback(
    (interval: number) => {
      onToggleMarketTooltip(false);
      setChartInterval(interval);
    },
    [onToggleMarketTooltip]
  );

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      marginTop: verticalScale(32)
    };
  }, []);

  const dismissTooltip = () => onToggleMarketTooltip(false);

  return (
    <TouchableWithoutFeedback onPress={dismissTooltip}>
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

        <Row
          style={styles.rowHelperContainer}
          justifyContent="center"
          alignItems="center"
        >
          <Row style={styles.innerRowContainer} alignItems="center">
            <View
              style={[
                styles.indicator,
                {
                  backgroundColor: '#77C33D'
                }
              ]}
            />
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral600}
            >
              Bond price
            </Text>
          </Row>
          <Row style={styles.innerRowContainer} alignItems="center">
            <View
              style={[
                styles.indicator,
                {
                  backgroundColor: '#8D5FEA'
                }
              ]}
            />
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral600}
            >
              Market price
            </Text>
          </Row>
        </Row>
      </View>
    </TouchableWithoutFeedback>
  );
};
