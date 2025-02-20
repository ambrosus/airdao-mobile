import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    paddingTop: scale(10),
    paddingHorizontal: scale(16)
  },
  addressWrapper: {
    padding: scale(3),
    backgroundColor: COLORS.neutral100,
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsWrapper: { flex: 1 },
  button: { width: '48%' },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: scale(15)
  }
});
