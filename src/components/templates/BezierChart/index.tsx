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
}

export function BezierChart(props: BezierChartProps): JSX.Element {
  const { height } = props;
  return (
    <VictoryChart theme={VictoryTheme.material} height={height}>
      <VictoryAxis
        dependentAxis={false}
        style={{
          axis: { stroke: '#222222' },
          grid: {
            stroke: '#222222', //CHANGE COLOR OF X-AXIS GRID LINES
            strokeDasharray: '7'
          },
          ticks: {
            fill: '#222222'
          },
          tickLabels: {
            fill: '#ffffff66' //CHANGE COLOR OF X-AXIS LABELS
          }
        }}
      />
      <VictoryLine
        interpolation="natural"
        style={{
          data: { stroke: '#ffffff66' }
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
