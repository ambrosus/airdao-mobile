import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    width: scale(350),
    borderRadius: moderateScale(13),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderWidth: 2
  },
  statusIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    marginRight: scale(14),
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtn: { alignSelf: 'center', marginLeft: scale(14) },
  actions: {
    marginTop: verticalScale(10),
    alignItems: 'flex-end'
  },
  actionBtn: {
    backgroundColor: COLORS.alphaBlack10,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12)
  }
});
