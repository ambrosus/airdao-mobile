import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
export const styles = StyleSheet.create({
  main: {
    padding: scale(16),
    marginHorizontal: scale(16),
    marginTop: scale(16),
    backgroundColor: COLORS.neutral100,
    borderRadius: 10
  },
  copyAll: {
    backgroundColor: COLORS.brand300,
    padding: scale(5),
    borderRadius: scale(15)
  }
});
