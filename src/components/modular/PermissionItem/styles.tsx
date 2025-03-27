import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
export const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral100,
    borderRadius: 12,
    padding: scale(15),
    justifyContent: 'space-between',
    marginBottom: scale(10)
  },
  container: { flexDirection: 'row' },
  defaultIcon: { justifyContent: 'center', alignItems: 'center' },
  image: { width: 32, height: 32 },
  button: {
    paddingVertical: scale(10)
  }
});
