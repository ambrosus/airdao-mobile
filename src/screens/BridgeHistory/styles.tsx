import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  header: { shadowColor: 'transparent' },
  container: {
    borderBottomWidth: 1,
    borderColor: COLORS.neutral900Alpha['5'],
    marginBottom: 15
  }
});
