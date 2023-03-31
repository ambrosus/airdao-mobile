import { COLORS } from '@constants/colors';
import React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme
} from 'victory-native';

export interface Point {
  x: number;
  y: number;
}
interface BezierChartProps {
  height?: number;
  data: Point[];
  strokeColor?: string;
  axisLabelColor?: string;
  axisColor?: string;
}

export function BezierChart(props: BezierChartProps): JSX.Element {
  const {
    height,
    strokeColor = COLORS.black,
    axisLabelColor = COLORS.black,
    axisColor = COLORS.black
  } = props;
  return (
    <VictoryChart theme={VictoryTheme.material} height={height}>
      <VictoryAxis
        dependentAxis={false}
        style={{
          axis: { stroke: axisColor },
          grid: {
            stroke: 'transparent' //CHANGE COLOR OF X-AXIS GRID LINES
          },
          ticks: {
            stroke: 'transparent'
          },
          tickLabels: {
            fill: axisLabelColor //CHANGE COLOR OF X-AXIS LABELS
          }
        }}
      />
      <VictoryLine
        interpolation="natural"
        style={{
          data: { stroke: strokeColor }
        }}
        data={[
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 5 },
          { x: 4, y: 4 },
          { x: 5, y: 5.5 },
          { x: 5, y: 6.5 }
        ]}
      />
    </VictoryChart>
  );
}
