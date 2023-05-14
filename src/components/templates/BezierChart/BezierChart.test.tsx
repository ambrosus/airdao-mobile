import React from 'react';
import { render } from '@testing-library/react-native';
import { BezierChart } from '@components/templates';
import { COLORS } from '@constants/colors';

jest.mock('victory-native', () => {
  return {
    VictoryChart: jest.fn(),
    VictoryTheme: {},
    VictoryLine: jest.fn(),
    VictoryAxis: jest.fn()
  };
});

describe('BezierChart', () => {
  const data = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 5.5 },
    { x: 5, y: 6.5 }
  ];
  it('renders with custom stroke color', () => {
    render(<BezierChart data={data} strokeColor={COLORS.jungleGreen} />);
  });

  it('renders a large dataset', () => {
    const largeData = [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 9 },
      { x: 9, y: 10 },
      { x: 10, y: 11 },
      { x: 11, y: 12 },
      { x: 12, y: 13 },
      { x: 13, y: 14 },
      { x: 14, y: 15 },
      { x: 15, y: 16 },
      { x: 16, y: 17 },
      { x: 17, y: 18 },
      { x: 18, y: 19 },
      { x: 19, y: 20 },
      { x: 20, y: 21 },
      { x: 21, y: 22 },
      { x: 22, y: 23 },
      { x: 23, y: 24 },
      { x: 24, y: 25 },
      { x: 25, y: 26 },
      { x: 26, y: 27 },
      { x: 27, y: 28 },
      { x: 28, y: 29 },
      { x: 29, y: 30 },
      { x: 30, y: 31 },
      { x: 31, y: 32 },
      { x: 32, y: 33 },
      { x: 33, y: 34 },
      { x: 34, y: 35 },
      { x: 35, y: 36 },
      { x: 36, y: 37 },
      { x: 37, y: 38 },
      { x: 38, y: 39 },
      { x: 39, y: 40 },
      { x: 40, y: 41 },
      { x: 41, y: 42 },
      { x: 42, y: 43 },
      { x: 43, y: 44 },
      { x: 44, y: 45 },
      { x: 45, y: 46 },
      { x: 46, y: 47 },
      { x: 47, y: 48 },
      { x: 48, y: 49 },
      { x: 49, y: 50 }
    ];

    const tree = render(
      <BezierChart
        data={largeData}
        strokeColor={COLORS.jungleGreen}
        axisLabelColor={COLORS.sapphireBlue}
        axisColor={COLORS.silver}
        height={400}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
