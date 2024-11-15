import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  separateLine: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.darkGrey,
    opacity: 0.1
  },
  floatButtonTitle: {
    fontFamily: 'Inter_600SemiBold'
  }
});
