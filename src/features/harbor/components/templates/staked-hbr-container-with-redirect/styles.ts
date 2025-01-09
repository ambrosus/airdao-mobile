import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  footer: {
    columnGap: scale(8)
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.brand600,
    height: 48
  },
  secondaryButton: {
    flex: 1,
    height: 48
  }
});
