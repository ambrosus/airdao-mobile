import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  header: { backgroundColor: 'transparent' },
  container: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.neutral100
  },
  wrapper: { paddingHorizontal: scale(18) },
  biometricWrapper: { paddingHorizontal: scale(18) }
});
