import { StyleSheet } from 'react-native';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartContainer: {
    marginHorizontal: 16
  }
});

export const chartConfigStyle: AbstractChartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  decimalPlaces: 4,
  color: () => '#000000',
  labelColor: () => 'black',
  propsForDots: {
    opacity: 0
  },
  propsForBackgroundLines: {
    strokeWidth: 0
  }
};
