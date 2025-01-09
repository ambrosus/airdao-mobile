import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(12),
    padding: scale(8),
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(16)
  },
  innerContainer: {
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(8)
  },
  rightColumnContainer: {
    alignItems: 'flex-end'
  }
});
