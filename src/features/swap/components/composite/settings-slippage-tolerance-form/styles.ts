import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(16)
  },
  slippageToleranceRow: {
    columnGap: scale(16)
  },
  symbol: {
    marginRight: 2
  }
});
