import React from 'react';
import { styles } from './styles';
import { Row } from '@components/base';
import { CHART_INTERVALS } from '@features/kosmos/constants';
import { ChartIntervalItem } from '../../base';

interface ChartTimeIntervalsProps {
  onChangeInterval: (interval: number) => void;
  chartInterval: number;
}

export const _ChartTimeIntervals = ({
  onChangeInterval,
  chartInterval
}: ChartTimeIntervalsProps) => {
  return (
    <Row style={styles.container} alignItems="center" justifyContent="center">
      {CHART_INTERVALS.map((interval) => (
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
