import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  footer: {
    marginTop: verticalScale(234),
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral100
  },
  button: {
    paddingHorizontal: scale(16)
  }
});
