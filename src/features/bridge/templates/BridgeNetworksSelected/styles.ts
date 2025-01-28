import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  previewWrapper: {
    paddingLeft: scale(10),
    minWidth: '43%',
    minHeight: scale(40),
    borderRadius: scale(45),
    backgroundColor: COLORS.neutral100,
    gap: scale(8)
  }
});
