import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingBottom: verticalScale(24)
  },
  contentContainer: {
    paddingHorizontal: scale(12)
  }
});
