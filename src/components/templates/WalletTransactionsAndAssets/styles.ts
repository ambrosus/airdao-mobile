import { StyleSheet } from 'react-native';
import { moderateScale, scale } from '@utils/scaling';

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
    backgroundColor: '#0e0e0e99',
    height: 0.5
  },
  notificationsBadge: {
    backgroundColor: '#fbf2cb',
    borderWidth: 1,
    borderColor: '#c8811a',
    right: 0,
    borderRadius: scale(20),
    width: moderateScale(23),
    height: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
