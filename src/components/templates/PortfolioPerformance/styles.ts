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
  innerContainer: {
    borderRadius: 16
  },
  logoContainer: {
    width: scale(102),
    height: scale(102),
    backgroundColor: COLORS.brand500,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: COLORS.neutral0,
    transform: [{ scale: 2 }, { translateX: scale(40) }],
    alignItems: 'flex-start',
    flex: 1
  },
  logo: {
    left: scale(6),
    top: scale(20),
    borderRadius: 16
  }
});
