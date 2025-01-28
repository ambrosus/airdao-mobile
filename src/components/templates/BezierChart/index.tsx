import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { LineGraph, GraphPoint } from 'react-native-graph';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { SelectionDot } from './SelectionDot';
import { styles } from './styles';

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
  const gestureStarted = useRef(false);

  const renderInterval = (interval: Interval, idx: number) => {
    const onPress = () => {
      if (typeof onIntervalSelected === 'function') {
        onIntervalSelected(interval);
      }
    };
    return (
      <Button
        testID="Chart_Interval"
        key={interval.value}
        onPress={onPress}
        style={idx > 0 ? styles.interval : {}}
      >
        <Text
          color={
            selectedInterval?.value === interval.value
              ? COLORS.brand600
              : COLORS.neutral300
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
    (point?: GraphPoint) => {
      if (typeof onPointSelected === 'function' && gestureStarted.current) {
        onPointSelected(point);
      }
    },
    [onPointSelected]
  );

  const onGestureEnd = useCallback(() => {
    _onPointSelected(undefined);
    gestureStarted.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gestureStarted.current]);

  return (
    <View>
      <LineGraph
        testID="Bezier_Chart"
        style={styles.lineGraph}
        points={data}
        animated={true}
        color={strokeColor}
        enablePanGesture={true}
        panGestureDelay={300}
        onGestureStart={() => (gestureStarted.current = true)}
        onGestureEnd={onGestureEnd}
        onPointSelected={_onPointSelected}
        SelectionDot={SelectionDot}
        verticalPadding={21}
      />
      {intervals.length > 0 && (
        <>
          {/* <Spacer value={verticalScale(21)} /> */}
          <Row alignItems="center" justifyContent="center">
            {intervals.map(renderInterval)}
          </Row>
        </>
      )}
    </View>
  );
}
