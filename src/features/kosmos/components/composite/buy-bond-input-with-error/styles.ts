import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  inputLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8
  },
  input: {
    textAlign: 'right',
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral900
  }
});
