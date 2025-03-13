import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  main: {
    padding: scale(12),
    borderWidth: 1,
    borderRadius: 16,
    marginTop: scale(10)
  },
  textWrapper: { alignItems: 'flex-end' },
  text: {
    fontSize: scale(16),
    color: COLORS.neutral900
  },
  activeLabel: {
    paddingHorizontal: scale(5),
    height: scale(20),
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: COLORS.success100,
    borderColor: COLORS.success200,
    borderRadius: 15
  }
});
