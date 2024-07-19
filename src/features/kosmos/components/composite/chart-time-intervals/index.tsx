import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { CHART_INTERVALS } from '@features/kosmos/constants';

interface ChartTimeIntervalsProps {
  onChangeInterval: (interval: number) => void;
  chartInterval: number;
}

export const _ChartTimeIntervals = ({
  onChangeInterval,
  chartInterval
}: ChartTimeIntervalsProps) => {
  return (
    <Row style={{ columnGap: 16 }} alignItems="center" justifyContent="center">
      {CHART_INTERVALS.map((interval) => (
        <TouchableOpacity
          onPress={() => onChangeInterval(interval.value)}
          key={interval.label}
        >
          <Text
            color={
              interval.value === chartInterval
                ? COLORS.black
                : COLORS.neutral300
            }
          >
            {interval.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Row>
  );
};

export const ChartTimeIntervals = React.memo(
  _ChartTimeIntervals,
  (prevProps, nextProps) => prevProps.chartInterval === nextProps.chartInterval
);
