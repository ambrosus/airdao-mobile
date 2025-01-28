import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  importButton: { marginRight: scale(5) },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800
  }
});
