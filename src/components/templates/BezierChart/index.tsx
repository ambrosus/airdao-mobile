import React, { useCallback } from 'react';
import { LineGraph, GraphPoint } from 'react-native-graph';
import { COLORS } from '@constants/colors';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { SelectionDot } from './SelectionDot';

interface Interval {
  text: string;
  value: any;
}

interface BezierChartProps {
  data: GraphPoint[];
  strokeColor?: string;
  axisLabelColor?: string;
  axisColor?: string;
  intervals?: Interval[];
  selectedInterval?: Interval;
  onPointSelected?: (point?: GraphPoint) => unknown;
  onIntervalSelected?: (interval: Interval) => unknown;
}

export function BezierChart(props: BezierChartProps): JSX.Element {
  const {
    strokeColor = COLORS.black,
    intervals = [],
    selectedInterval,
    data,
    onPointSelected,
    onIntervalSelected
  } = props;

  const renderInterval = (interval: Interval) => {
    const onPress = () => {
      if (typeof onIntervalSelected === 'function') {
        onIntervalSelected(interval);
      }
    };
    return (
      <Button key={interval.value} onPress={onPress}>
        <Text
          color={
            selectedInterval?.value === interval.value
              ? COLORS.mainBlue
              : COLORS.asphalt
          }
          fontSize={13}
          fontFamily="Inter_600SemiBold"
        >
          {interval.text}
        </Text>
      </Button>
    );
  };

  const _onPointSelected = useCallback(
    (point: GraphPoint) => {
      if (typeof onPointSelected === 'function') {
        onPointSelected(point);
      }
    },
    [onPointSelected]
  );

  const onGestureEnd = useCallback(() => {
    _onPointSelected(data[data.length - 1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <View>
      <LineGraph
        style={{
          width: '100%',
          aspectRatio: 1.4
        }}
        points={data}
        animated={true}
        color={strokeColor}
        enablePanGesture={true}
        panGestureDelay={300}
        onGestureEnd={onGestureEnd}
        onPointSelected={_onPointSelected}
        SelectionDot={SelectionDot}
      />
      {intervals.length > 0 && (
        <>
          <Row
            alignItems="center"
            justifyContent="space-between"
            style={styles.intervalsContainer}
          >
            {intervals.map(renderInterval)}
          </Row>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  intervalsContainer: {
    width: '80%',
    marginHorizontal: scale(36.5)
  }
});
