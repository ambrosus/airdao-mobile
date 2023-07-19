import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 16
  },
  innerContainer: {
    overflow: 'hidden',
    borderRadius: 16
  },
  details: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(18)
  },
  logoContainer: {
    width: scale(102),
    height: scale(102),
    backgroundColor: COLORS.deepBlue,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: COLORS.white,
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
