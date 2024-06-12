import { StyleSheet } from 'react-native';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  rowGap: {
    gap: scale(8)
  },
  reorder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100
  }
});
