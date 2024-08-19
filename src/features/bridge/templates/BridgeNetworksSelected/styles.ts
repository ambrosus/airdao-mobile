import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  previewWrapper: {
    minWidth: scale(120),
    minHeight: scale(40),
    borderRadius: scale(15),
    backgroundColor: COLORS.neutral100,
    gap: scale(8)
  },
  reorder: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100
  }
});
