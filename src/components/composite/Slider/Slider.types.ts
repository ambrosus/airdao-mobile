import { ViewStyle } from 'react-native';

export interface SliderProps {
  width: number;
  minValue: number;
  maxValue: number;
  knobSize?: number;
  fillColor?: string;
  emptyColor?: string;
  knobColor?: string;
  style?: ViewStyle;
  onEndDrag?: (value: number) => unknown;
  onEndDrag2?: (value: number) => unknown;
  isSecondPointVisible?: boolean;
}
