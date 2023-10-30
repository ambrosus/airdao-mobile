import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  ambNetworkOnly: {
    marginVertical: verticalScale(16),
    backgroundColor: COLORS.alphaBlack5,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(16)
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16),
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: 1000,
    backgroundColor: COLORS.alphaBlack5
  }
});
