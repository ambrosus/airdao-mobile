import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';

export type DataPointsPressEventHandler = {
  index: number;
  value: number;
  dataset: Dataset;
  x: number;
  y: number;
  getColor: (opacity: number) => string;
};

export type TooltipAxisState = {
  x: number;
  y: number;
  visible: boolean;
  value: { bond: number; market: number; timestamp: number };
};
