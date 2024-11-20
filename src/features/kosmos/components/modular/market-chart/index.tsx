import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { chartConfigStyle, styles } from './styles';
import { DataPointsPressEventHandler, TooltipState } from './types';
import { useChartStore } from '@features/kosmos';
import { ChartTooltip } from '@features/kosmos/components/composite';
import { mapper } from '@features/kosmos/utils';
import {
  ApiPricesResponse,
  CHART_HEIGHT,
  CHART_WIDTH,
  CHART_Y_AXIS_INTERVAL,
  getSDAPriceForChart,
  getTokenPriceForChart,
  MarketType,
  replaceTimestamps
} from '@entities/kosmos';

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
  const {
    isChartTooltipVisible,
    onToggleIsChartTooltipVisible,
    onToggleIsChartLoading
  } = useChartStore();

  const [marketPrices, setMarketPrices] = useState<number[][]>([]);
  const [bondPrices, setBondPrices] = useState<number[][]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    value: { bond: 0, market: 0, timestamp: 0, discount: 0 }
  });

  const fetchChartPoints = useCallback(
    async (controller: AbortController) => {
      try {
        onToggleIsChartLoading(true);

        const now = new Date();
        const from = chartInterval
          ? now.getTime() - chartInterval
          : market.start;

        getTokenPriceForChart(
          tokenAddress,
          from,
          new Date().getTime(),
          controller.signal
        )
          .then((res) => {
            const market: number[][] = [];
            const bond: number[][] = [];

            res.data.forEach((el: ApiPricesResponse) => {
              market.push([el.timestamp, el.price]);
              bond.push([el.timestamp, fpaPrice ?? 0]);
            });
            if (fpaPrice) {
              setMarketPrices(market);
              setBondPrices(bond);
            } else {
              setMarketPrices(market);
            }

            return res.data;
          })
          .then((market) => {
            if (!fpaPrice) {
              getSDAPriceForChart(
                marketId,
                from,
                new Date().getTime(),
                controller.signal
              ).then(({ data }) => {
                setBondPrices([
                  ...replaceTimestamps(data, market).map((el) => [
                    el.timestamp,
                    quotePrice ?? 0 / el.price
                  ]),
                  [market[market.length - 1].timestamp, askingPrice]
                ]);
              });
            }
          });
      } catch (error) {
        throw error;
      } finally {
        onToggleIsChartLoading(false);
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
    setTooltip({
      x: 0,
      y: 0,
      value: { bond: 0, market: 0, timestamp: 0, discount: 0 }
    });
    onToggleIsChartTooltipVisible(true);
  }, [onToggleIsChartTooltipVisible]);

  // Reset show tooltip state after navigated back
  useFocusEffect(
    useCallback(() => {
      return () => onToggleIsChartTooltipVisible(false);
    }, [onToggleIsChartTooltipVisible])
  );

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
      const timestamp = marketPrices[index][0];

      const discountPercentage =
        ((marketPrice - bondPrice) / marketPrice) * 100;

      setTooltip({
        x,
        y,
        value: {
          bond: bondPrice,
          market: marketPrice,
          timestamp,
          discount: discountPercentage
        }
      });
      onToggleIsChartTooltipVisible(true);
    },
    [marketPrices, onToggleIsChartTooltipVisible, points.bonds, points.market]
  );

  const onDataPointClick = useCallback(
    (point: DataPointsPressEventHandler) => {
      const { x, y, index } = point;
      if (tooltip.x === x && tooltip.y === y) onDismissTooltip();

      return updateTooltipData(x, y, index);
    },
    [tooltip.x, tooltip.y, onDismissTooltip, updateTooltipData]
  );

  const isChartComputedPoints = useMemo(() => {
    return points.bonds.length > 0 && points.market.length > 0;
  }, [points]);

  return (
    <View style={styles.container}>
      {isChartComputedPoints && (
        <LineChart
          style={styles.chartContainer}
          data={{
            labels: [],
            datasets: [
              {
                data: points.market,
                color: () => '#8D5FEA',
                strokeWidth: 1,
                withDots: true
              },
              {
                data: points.bonds,
                color: () => '#77C33D',
                strokeWidth: 1,
                withDots: true
              }
            ]
          }}
          decorator={() =>
            isChartTooltipVisible && <ChartTooltip tooltip={tooltip} />
          }
          withInnerLines={true}
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
  );
};
