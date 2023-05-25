import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  headerContainer: {
    paddingLeft: scale(16)
  },
  balanceSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.slateGrey,
    opacity: 1
  },
  balanceCount: {
    fontFamily: 'Mersad_600SemiBold',
    fontSize: 36,
    color: COLORS.smokyBlack
  },
  balanceStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceTokens: {
    marginRight: scale(14)
  }
});
