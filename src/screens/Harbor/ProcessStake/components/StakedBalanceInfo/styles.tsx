import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral0,
    padding: scale(12),
    borderRadius: 16
  },
  textStyle: {
    color: COLORS.neutral900,
    fontSize: 14
  }
});
