import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: scale(16)
  },
  words: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    rowGap: scale(16),
    columnGap: verticalScale(16)
  },
  word: {
    backgroundColor: COLORS.culturedWhite,
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(4)
  }
});
