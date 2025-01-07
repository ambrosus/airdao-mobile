import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  listMain: {
    backgroundColor: COLORS.neutral0,
    borderRadius: 16,
    padding: scale(8)
  },
  dateWrapper: {
    padding: scale(8),
    backgroundColor: COLORS.neutral50,
    borderRadius: 8
  }
});
