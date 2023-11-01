import { COLORS } from '@constants/colors';
import { shadow } from '@constants/shadow';
import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(37),
    paddingBottom: verticalScale(29),
    backgroundColor: COLORS.neutral0,
    borderRadius: 24,
    alignItems: 'center',
    ...shadow
  },
  badge: {
    alignSelf: 'center'
  },
  balance: {
    alignSelf: 'center'
  },
  balanceAction: {
    backgroundColor: '#FFFFFF1A',
    width: scale(24),
    height: scale(24),
    marginLeft: scale(14)
  },
  balanceLast24HourChange: {
    marginHorizontal: scale(13)
  }
});
