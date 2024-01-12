import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  header: {
    shadowColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: COLORS.neutral900
  }
});
