import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(29),
    alignItems: 'center'
  }
});
