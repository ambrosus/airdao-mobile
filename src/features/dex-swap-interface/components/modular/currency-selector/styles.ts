import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  currencySelector: {
    paddingVertical: scale(6),
    maxHeight: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderRadius: 1000
  }
});
