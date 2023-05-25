import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderColor: COLORS.charcoal,
    borderTopWidth: 0
  },
  toggleBtn: {
    borderRadius: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: scale(12)
  },
  chevronIcon: {
    width: scale(12),
    height: scale(12)
  },
  item: {
    marginTop: verticalScale(20)
  },
  emptyContainer: {
    paddingTop: verticalScale(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: scale(200)
  },
  addBtn: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(200)
  },
  rightActions: {
    marginTop: 30,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 152,
    height: scale(82),
    flexDirection: 'row',
    backgroundColor: COLORS.charcoal
  }
});
