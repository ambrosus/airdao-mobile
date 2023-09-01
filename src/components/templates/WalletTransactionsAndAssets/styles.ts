import { StyleSheet } from 'react-native';
import { moderateScale, scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  tabLeftTitle: {
    justifyContent: 'center',
    paddingLeft: scale(55)
  },
  tabRightTitle: {
    justifyContent: 'center',
    paddingRight: scale(55)
  },
  tabsIndicator: {
    backgroundColor: COLORS.alphaBlack10,
    height: 0.5
  },
  notificationsBadge: {
    backgroundColor: COLORS.lightYellow,
    borderWidth: 1,
    borderColor: COLORS.orange,
    right: 0,
    borderRadius: scale(20),
    width: moderateScale(23),
    height: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
