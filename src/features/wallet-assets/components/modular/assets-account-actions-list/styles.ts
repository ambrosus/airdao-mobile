import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    columnGap: scale(8)
  },
  receiveFundsBottomSheetContainer: {
    paddingBottom: verticalScale(56),
    paddingHorizontal: scale(24)
  }
});
