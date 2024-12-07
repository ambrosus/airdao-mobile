import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.neutral200,
    padding: scale(16),
    borderRadius: 16
  },
  title: {
    color: COLORS.neutral600
  },
  text: {
    color: COLORS.neutral900
  }
});
