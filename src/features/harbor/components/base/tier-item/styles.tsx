import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: 8
  },
  text: {
    color: COLORS.neutral900
  },

  available: {
    backgroundColor: COLORS.neutral100,
    color: COLORS.neutral900
  },
  active: {
    backgroundColor: COLORS.brand500,
    color: COLORS.neutral0
  },
  disabled: {
    backgroundColor: COLORS.neutral100,
    color: COLORS.neutral200
  }
});
