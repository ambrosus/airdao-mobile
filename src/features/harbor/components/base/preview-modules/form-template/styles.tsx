import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(10),
    paddingVertical: scale(12)
  },
  title: {
    fontSize: 16,
    color: COLORS.neutral600
  }
});
