import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral0
  },
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderWidth: 2,
    borderColor: '#D8DAE0',
    borderRadius: 1000,
    transform: [{ rotate: '90deg' }],
    elevation: 2,
    shadowColor: '#C2C5CC',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    zIndex: 99999
  }
});
