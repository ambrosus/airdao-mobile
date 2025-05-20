import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(4),
    marginBottom: scale(4),
    width: '100%',
    height: scale(40)
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(50)
  },
  backIconWrapper: {
    transform: [{ rotate: '270deg' }],
    marginLeft: scale(6),
    pointerEvents: 'none'
  },
  urlWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  urlText: {
    color: COLORS.neutral900,
    textAlign: 'center',
    fontSize: scale(14)
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: scale(72),
    minHeight: scale(32),
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    borderRadius: scale(16),
    paddingHorizontal: scale(8) // Add internal padding
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    width: 1,
    height: scale(20),
    backgroundColor: COLORS.neutral200
  },
  leftContainer: {
    width: scale(50),
    justifyContent: 'center'
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center'
  }
});
