import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, moderateScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.culturedWhite,
    backgroundColor: 'white'
  },
  leftContainer: { bottom: scale(3) },
  notificationCountContainer: {
    position: 'absolute',
    backgroundColor: COLORS.yellow500,
    right: -3,
    top: -3,
    borderRadius: scale(11),
    borderWidth: 2,
    borderColor: COLORS.neutral0,
    width: moderateScale(11),
    height: moderateScale(11),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
