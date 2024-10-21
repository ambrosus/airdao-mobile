import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  chartContainer: {
    marginHorizontal: 16
  },
  chartMaskBackground: {
    width: '75%',
    height: 190,
    position: 'absolute',
    top: 0,
    right: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 999
  },
  chartMaskLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.black
  }
});

export const chartConfigStyle: AbstractChartConfig = {
  backgroundColor: 'white',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  decimalPlaces: 4,
  color: () => COLORS.neutral100,
  labelColor: () => COLORS.neutral400,
  propsForDots: {
    opacity: 0
  },
  propsForLabels: {
    fontFamily: 'Inter_500Medium'
  },
  propsForBackgroundLines: {
    strokeDasharray: ''
  }
};
