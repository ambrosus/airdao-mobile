import React, { useCallback } from 'react';
import { LineGraph, GraphPoint } from 'react-native-graph';
import { COLORS } from '@constants/colors';
import { View } from 'react-native';
import { Button, Row, Text } from '@components/base';
import { scale } from '@utils/scaling';

interface BezierChartProps {
  height?: number;
  data: GraphPoint[];
  strokeColor?: string;
  axisLabelColor?: string;
  axisColor?: string;
  intervals?: string[];
  onPointSelected?: (point: GraphPoint) => unknown;
}

export function BezierChart(props: BezierChartProps): JSX.Element {
  const {
    height,
    strokeColor = COLORS.black,
    axisLabelColor = COLORS.black,
    axisColor = COLORS.black,
    intervals = [],
    data,
    onPointSelected
  } = props;

  const length = data.length;

  const renderInterval = (interval: string) => {
    return (
      <Button key={interval}>
        <Text>{interval}</Text>
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

  const onGestureStart = useCallback(() => {
    console.log('on gesture start');
  }, []);

  const onGestureEnd = useCallback(() => {
    console.log('on gesture end');
    _onPointSelected(data[data.length - 1]);
  }, [data]);

  return (
    <View>
      <LineGraph
        style={{
          width: '100%',
          aspectRatio: 1.2,
          marginBottom: 100
        }}
        verticalPadding={30}
        points={data}
        animated={true}
        color={strokeColor}
        enablePanGesture={true}
        panGestureDelay={300}
        onGestureStart={onGestureStart}
        onGestureEnd={onGestureEnd}
        onPointSelected={_onPointSelected}
        // onGestureEnd={() => {
        //   if (typeof onPointSelected == 'function') {
        //     // onPointSelected(data[data.length - 1]);
        //   }
        // }}
      />
      {intervals.length > 0 && (
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={{ width: '80%', marginHorizontal: scale(36.5) }}
        >
          {intervals.map(renderInterval)}
        </Row>
      )}
    </View>
  );
}
