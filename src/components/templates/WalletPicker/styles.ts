import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  circularAvatar: {
    borderRadius: 1000,
    overflow: 'hidden'
  },
  checkmark: {
    borderRadius: 12,
    height: 24,
    width: 24,
    backgroundColor: COLORS.success300,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
