import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: '40%',
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.culturedWhite
  },
  horizontalPadding: {
    paddingHorizontal: scale(25)
  },
  shareBtn: {
    backgroundColor: '#2f2b430d'
  },
  body: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(24),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    marginTop: verticalScale(25)
  }
});
