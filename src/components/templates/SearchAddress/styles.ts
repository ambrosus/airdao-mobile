import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  input: {
    width: '65%'
  },
  top: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  divider: {
    height: 1,
    backgroundColor: '#2f2b431a'
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanner: {
    backgroundColor: COLORS.powderWhite,
    height: moderateScale(48),
    width: moderateScale(48)
  },
  trackBtn: {
    backgroundColor: COLORS.deepBlue,
    paddingVertical: verticalScale(9),
    width: Dimensions.get('window').width - verticalScale(32),
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSheetHeader: {
    marginHorizontal: -20,
    marginBottom: -20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
});
