import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24)
  },
  currencyBadge: {
    paddingHorizontal: scale(8),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    borderRadius: 1000
  }
});
