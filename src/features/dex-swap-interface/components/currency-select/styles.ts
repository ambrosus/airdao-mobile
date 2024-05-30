import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.neutral200,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  }
});
