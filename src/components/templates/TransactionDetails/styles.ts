import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  status: {
    paddingHorizontal: scale(8),
    borderRadius: 1000,
    backgroundColor: COLORS.success100,
    minHeight: verticalScale(24)
  }
});
