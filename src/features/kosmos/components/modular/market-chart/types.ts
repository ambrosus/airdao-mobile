import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

export type DataPointsPressEventHandler = {
  index: number;
  value: number;
  dataset: Dataset;
  x: number;
  y: number;
  getColor: (opacity: number) => string;
};

export type TooltipAxis = {
  x: number;
  y: number;
};

export interface TooltipState extends TooltipAxis {
  value: { bond: number; market: number; timestamp: number; discount: number };
}
