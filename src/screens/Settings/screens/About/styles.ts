import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    rowGap: verticalScale(8)
  },
  header: { backgroundColor: 'transparent', marginBottom: 10 },
  menuItem: {
    marginHorizontal: scale(16),
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.alphaBlack5
  },
  version: {
    marginBottom: 15
  }
});
