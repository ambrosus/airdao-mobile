import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    width: scale(119),
    height: scale(32),
    backgroundColor: COLORS.success100,
    borderRadius: 24,
    padding: scale(5)
  }
});
