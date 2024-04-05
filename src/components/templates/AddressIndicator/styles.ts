import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.brand100,
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(8),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center'
  }
});
