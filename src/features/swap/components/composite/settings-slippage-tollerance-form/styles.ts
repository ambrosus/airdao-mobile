import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(16)
  },
  slippageTolleranceRow: {
    columnGap: scale(16)
  }
});
