import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    width: scale(350),
    borderRadius: moderateScale(13),
    backgroundColor: COLORS.green100,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderColor: COLORS.green200
  },
  statusIcon: {
    backgroundColor: COLORS.green400,
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    marginRight: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  closeBtn: { alignSelf: 'flex-start', marginLeft: scale(14) }
});
