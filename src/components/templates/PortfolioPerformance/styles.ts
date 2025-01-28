import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(24),
    backgroundColor: COLORS.brand600
  },
  logo: {
    left: scale(6),
    top: scale(20),
    borderRadius: 16
  }
});
