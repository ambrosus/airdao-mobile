import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrCode: {
    backgroundColor: COLORS.white,
    padding: moderateScale(18),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: COLORS.neutral100,
    marginVertical: verticalScale(16)
  },
  shareBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: 1000,
    backgroundColor: COLORS.alphaBlack5
  }
});
