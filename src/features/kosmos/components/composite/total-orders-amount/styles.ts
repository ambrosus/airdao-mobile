import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(18),
    borderRadius: 16,
    backgroundColor: COLORS.neutral100,
    rowGap: verticalScale(12)
  },
  keyTypography: {
    letterSpacing: 0.36
  }
});
