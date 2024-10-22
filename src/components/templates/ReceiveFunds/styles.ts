import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  qrCode: {
    backgroundColor: COLORS.neutral0,
    padding: moderateScale(18),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: COLORS.neutral100,
    marginVertical: verticalScale(16)
  },
  copyBtn: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(24),
    borderRadius: 1000
  }
});
