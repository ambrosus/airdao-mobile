import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
export const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.neutral200,
    marginBottom: scale(12),
    padding: scale(5),
    borderRadius: 10
  }
});
