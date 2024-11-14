import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  previewWrapper: {
    paddingLeft: scale(10),
    minWidth: '43%',
    minHeight: scale(40),
    borderRadius: scale(45),
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
