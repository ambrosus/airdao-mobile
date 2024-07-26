import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16.5)
  },
  header: {
    paddingLeft: 0,
    paddingRight: 0
  },
  leftContainerStyles: {
    left: scale(16.5)
  },
  rightContainerStyles: {
    right: scale(16.5)
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    fontSize: moderateScale(24),
    color: COLORS.neutral800
  }
});
