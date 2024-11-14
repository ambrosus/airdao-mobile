import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
    borderTopColor: COLORS.neutral100,
    borderRadius: 24
  },
  button: {
    paddingHorizontal: scale(16)
  }
});
