import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  details: {},
  balance: {
    flexDirection: 'row'
  },
  amount: {
    marginLeft: scale(7),
    color: COLORS.neutral900,
    fontWeight: '600',
    fontSize: scale(14)
  },
  destination: {
    marginTop: 4,
    color: COLORS.alphaBlack50,
    fontWeight: '500',
    fontSize: scale(12)
  },
  confirmation: {}
});
