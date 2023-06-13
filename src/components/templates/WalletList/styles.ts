import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderColor: COLORS.charcoal,
    borderTopWidth: 0
  },
  item: {
    backgroundColor: COLORS.white
  },
  emptyContainer: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200)
  },
  rightActions: {
    backgroundColor: COLORS.charcoal,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: scale(130)
  }
});
