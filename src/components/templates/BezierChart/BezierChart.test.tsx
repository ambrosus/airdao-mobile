import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GraphPoint } from 'react-native-graph';
import { BezierChart } from '@components/templates';
import { COLORS } from '@constants/colors';
import clearAllMocks = jest.clearAllMocks;

describe('BezierChart', () => {
  afterAll(() => {
    clearAllMocks();
  });

  const mockedData: GraphPoint[] = [
    {
      value: 10,
      date: new Date('10.07.2023T10:40')
    },
    {
      value: 48,
      date: new Date('10.07.2023T12:40')
    },
    {
      value: 96,
      date: new Date('10.07.2023T14:40')
    },
    {
      value: 123,
      date: new Date('10.07.2023T16:40')
    },
    {
      value: 40,
      date: new Date('10.07.2023T18:40')
    }
  ];

  const onPointSelected = jest.fn();
  const onIntervalSelected = jest.fn();

  beforeEach(() => {
    onPointSelected.mockClear();
    onIntervalSelected.mockClear();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<BezierChart data={mockedData} />);
    const chart = getByTestId('Bezier_Chart');
    expect(chart).toBeDefined();
  });

  it('renders the chart with the correct props', () => {
    const { getByTestId } = render(
      <BezierChart
        data={mockedData}
        strokeColor={COLORS.success300}
        axisLabelColor={COLORS.neutral900}
        axisColor="transparent"
      />
    );
    const chart = getByTestId('Bezier_Chart');
    expect(chart.props.points).toEqual(mockedData);
    expect(chart.props.color).toEqual(COLORS.success300);
  });

  it('allows panning and calls onGestureStart and onGestureEnd callbacks', async () => {
    const { getByTestId } = render(
      <BezierChart data={mockedData} onPointSelected={onPointSelected} />
    );
    const chart = getByTestId('Bezier_Chart');

    // Pan left
    fireEvent(chart, 'gesturestart', {
      nativeEvent: { touches: [{ pageX: 200 }] }
    });
    fireEvent(chart, 'gestureend', {
      nativeEvent: { touches: [{ pageX: 100 }] }
    });
    expect(onPointSelected).not.toHaveBeenCalled();

    // Pan right
    fireEvent(chart, 'gesturestart', {
      nativeEvent: { touches: [{ pageX: 100 }] }
    });
    fireEvent(chart, 'gestureend', {
      nativeEvent: { touches: [{ pageX: 200 }] }
    });
    expect(onPointSelected).not.toHaveBeenCalled();
  });

  it('renders intervals and calls onIntervalSelected callback', () => {
    const intervals = [
      { text: 'Interval 1', value: 'interval1' },
      { text: 'Interval 2', value: 'interval2' }
    ];
    const { getByText } = render(
      <BezierChart
        data={mockedData}
        intervals={intervals}
        onIntervalSelected={onIntervalSelected}
      />
    );
    const interval1 = getByText('Interval 1');
    const interval2 = getByText('Interval 2');

    fireEvent.press(interval1);
    expect(onIntervalSelected).toHaveBeenCalledWith(intervals[0]);

    fireEvent.press(interval2);
    expect(onIntervalSelected).toHaveBeenCalledWith(intervals[1]);
  });
});
