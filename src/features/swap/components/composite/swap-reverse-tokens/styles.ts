import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral0
  },
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderWidth: 5,
    borderColor: COLORS.neutral0,
    borderRadius: 1000,
    transform: [{ rotate: '90deg' }],
    elevation: 2,
    shadowColor: COLORS.gray300,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 99999
  }
});
