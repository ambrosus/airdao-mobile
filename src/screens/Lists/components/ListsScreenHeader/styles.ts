import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  headerContainer: { paddingTop: 5, paddingLeft: 16 },
  badgeButtonsContainer: {
    flexDirection: 'row',
    paddingRight: 17,
    justifyContent: 'flex-end'
  },
  settingsButton: {
    marginRight: 16
  },
  balanceSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.lightGrey,
    opacity: 1
  },
  balanceCount: {
    paddingBottom: 12,
    fontFamily: 'Mersad_600SemiBold',
    fontSize: 36,
    color: COLORS.black
  },
  balanceStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceTokens: {
    paddingRight: 14
  },
  progressInfo: {
    paddingLeft: 7,
    paddingRight: 4
  },
  badgeButtonContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ' rgba(47, 43, 67, 0.05)'
  },
  badgeButtonIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
