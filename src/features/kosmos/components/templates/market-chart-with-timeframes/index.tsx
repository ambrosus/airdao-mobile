import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { useTranslation } from 'react-i18next';
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
  onScrollToMarket: () => void;
}

export const MarketChartsWithTimeframes = ({
  market,
  onScrollToMarket
}: MarketChartsWithTimeframesProps) => {
  const { t } = useTranslation();
  const { onToggleMarketTooltip } = useKosmosMarketsContextSelector();
  const { quoteToken } = useMarketDetails(market);
  const [chartInterval, setChartInterval] = useState(CHART_INTERVALS[2].value);

  const onChangeInterval = useCallback(
    (interval: number) => {
      onScrollToMarket();
      onToggleMarketTooltip(false);
      setChartInterval(interval);
    },
    [onScrollToMarket, onToggleMarketTooltip]
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
          fpaPrice={market.marketType === 'FPA' ? market.askingPrice : null}
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
              {t('kosmos.chart.explanation.bond')}
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
              {t('kosmos.chart.explanation.market')}
            </Text>
          </Row>
        </Row>
      </View>
    </TouchableWithoutFeedback>
  );
};
