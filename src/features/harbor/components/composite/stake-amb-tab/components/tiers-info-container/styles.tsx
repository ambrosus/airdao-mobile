import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.neutral0,
    borderRadius: 16,
    padding: scale(16)
  }
});
