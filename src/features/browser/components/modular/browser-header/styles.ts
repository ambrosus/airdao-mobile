import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';
export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(4),
    paddingHorizontal: scale(4),
    width: '100%'
  },
  walletButton: {
    flexDirection: 'row'
  },
  backIconWrapper: {
    transform: [{ rotate: '270deg' }],
    marginLeft: scale(6),
    pointerEvents: 'none'
  },
  urlWrapper: {
    alignSelf: 'center'
  },
  actionsContainer: {
    flexDirection: 'row',
    minWidth: scale(72),
    minHeight: scale(32),
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    borderRadius: 72,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    position: 'absolute',
    left: '50%',
    width: 1,
    height: 20,
    backgroundColor: COLORS.neutral200
  }
});
