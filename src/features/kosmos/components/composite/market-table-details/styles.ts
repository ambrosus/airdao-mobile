import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(20),
    paddingHorizontal: scale(16),
    rowGap: verticalScale(16)
  },
  bondAssetsRow: {
    columnGap: 4
  }
});
