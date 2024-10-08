import React, { useMemo } from 'react';
import { styles } from './styles';
import { Row } from '@components/base';
import { CHART_INTERVALS } from '@features/kosmos/constants';
import { ChartIntervalItem } from '@features/kosmos/components/base';

interface ChartTimeIntervalsProps {
  onChangeInterval: (interval: number) => void;
  chartInterval: number;
  fpaPrice: number | null;
}

export const _ChartTimeIntervals = ({
  onChangeInterval,
  chartInterval,
  fpaPrice
}: ChartTimeIntervalsProps) => {
  const intervals = useMemo(() => {
    return !!fpaPrice ? CHART_INTERVALS : CHART_INTERVALS.slice(2);
  }, [fpaPrice]);

  return (
    <Row style={styles.container} alignItems="center" justifyContent="center">
      {intervals.map((interval) => (
        <ChartIntervalItem
          key={interval.label}
          selectedInterval={chartInterval}
          interval={interval}
          onChangeInterval={onChangeInterval}
        />
      ))}
    </Row>
  );
};

export const ChartTimeIntervals = React.memo(
  _ChartTimeIntervals,
  (prevProps, nextProps) => prevProps.chartInterval === nextProps.chartInterval
);
