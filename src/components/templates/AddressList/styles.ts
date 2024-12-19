import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderColor: COLORS.alphaBlack5,
    borderTopWidth: 0
  },
  item: {
    backgroundColor: COLORS.neutral0
  },
  emptyContainer: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200)
  },
  rightActions: {
    backgroundColor: COLORS.alphaBlack5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: scale(130)
  },
  rightActionsButton: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
