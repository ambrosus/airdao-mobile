import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartConfigStyle, styles } from './styles';
import {
  getTokenPriceForChart,
  getSDAPriceForChart
} from '@features/kosmos/api';
import { ApiPricesResponse, MarketType } from '@features/kosmos/types';
import { mapper, downsample, replaceTimestamps } from '@features/kosmos/utils';
import {
  CHART_WIDTH,
  CHART_HEIGHT,
  CHART_Y_AXIS_INTERVAL
} from '@features/kosmos/constants';
import { DataPointsPressEventHandler, TooltipAxisState } from './types';

type MarketChartProps = {
  tokenAddress: string;
  marketStart: number;
  fpaPrice: number | null;
  marketId: string;
  quotePrice: number | undefined;
  askingPrice: number;
  chartInterval: number;
  market: MarketType;
};

export const MarketChart = ({
  tokenAddress,
  fpaPrice,
  marketId,
  quotePrice,
  askingPrice,
  chartInterval,
  market
}: MarketChartProps) => {
  const [marketPrices, setMarketPrices] = useState<Array<number[]>>([]);
  const [bondPrices, setBondPrices] = useState<Array<number[]>>([]);
  const [tooltipAxis, setTooltipAxis] = useState<TooltipAxisState>({
    x: 0,
    y: 0,
    value: { bond: 0, market: 0, timestamp: 0 },
    visible: false
  });

  const fetchChartPoints = useCallback(
    async (controller: AbortController) => {
      try {
        const now = new Date();
        const from = chartInterval
          ? now.getTime() - chartInterval
          : market.start;

        const { data: prices } = await getTokenPriceForChart(
          tokenAddress,
          from,
          now.getTime(),
          controller.signal
        );

        const markets: number[][] = [];
        const bonds: number[][] = [];

        prices.forEach((element: ApiPricesResponse) => {
          markets.push([element.timestamp, element.price]);
          bonds.push([element.timestamp, fpaPrice ?? 0]);
        });

        setMarketPrices(markets);

        if (fpaPrice) {
          setBondPrices(bonds);
        } else {
          getSDAPriceForChart(
            marketId,
            from,
            now.getTime(),
            controller.signal
          ).then(({ data }) => {
            setBondPrices([
              ...replaceTimestamps(data, markets as any).map((el) => [
                el.timestamp,
                quotePrice ?? 0 / el.price
              ]),
              [markets[markets.length - 1][0], askingPrice]
            ]);
          });
        }
      } catch (error) {
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartInterval]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchChartPoints(controller);

    return () => controller.abort();
  }, [chartInterval, fetchChartPoints]);

  const onDismissTooltip = useCallback(() => {
    setTooltipAxis({
      x: 0,
      y: 0,
      visible: false,
      value: { bond: 0, market: 0, timestamp: 0 }
    });
  }, []);

  const points = useMemo(() => {
    return {
      market: mapper(marketPrices),
      bonds: mapper(bondPrices)
    };
  }, [bondPrices, marketPrices]);

  const updateTooltipData = useCallback(
    (x: number, y: number, index: number) => {
      const bondPrice = points.bonds[index];
      const marketPrice = points.market[index];
      const timestamp = marketPrices[index][1];

      setTooltipAxis({
        x,
        y,
        value: { bond: bondPrice, market: marketPrice, timestamp },
        visible: true
      });
    },
    [marketPrices, points.bonds, points.market]
  );

  const onDataPointClick = useCallback(
    (point: DataPointsPressEventHandler) => {
      const { x, y, index } = point;
      if (tooltipAxis.x === x && tooltipAxis.y === y) onDismissTooltip();

      return updateTooltipData(x, y, index);
    },
    [tooltipAxis.x, tooltipAxis.y, onDismissTooltip, updateTooltipData]
  );

  const isChartComputedPoints = useMemo(() => {
    return points.bonds.length > 0 && points.market.length > 0;
  }, [points]);

  return (
    <TouchableWithoutFeedback onPress={onDismissTooltip}>
      <View style={styles.container}>
        {isChartComputedPoints && (
          <LineChart
            style={styles.chartContainer}
            data={{
              labels: [],
              datasets: [
                {
                  data: downsample(points.market, 100),
                  color: () => '#8D5FEA',
                  strokeWidth: 1,
                  withDots: true
                },
                {
                  data: downsample(points.bonds, 100),
                  color: () => '#77C33D',
                  strokeWidth: 1,
                  withDots: true
                }
              ]
            }}
            withInnerLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withShadow={false}
            segments={3}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            onDataPointClick={onDataPointClick}
            yAxisLabel="$"
            yAxisInterval={CHART_Y_AXIS_INTERVAL}
            chartConfig={chartConfigStyle}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
