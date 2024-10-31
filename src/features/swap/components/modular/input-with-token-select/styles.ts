import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: scale(16)
  },
  upperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8)
  },
  input: {
    width: 'auto',
    paddingVertical: 0,
    borderWidth: 0,
    fontSize: moderateScale(22),
    fontFamily: 'Inter_700Bold',
    paddingLeft: 0.5,
    paddingRight: 0.5
  },
  inputAndroidSpecified: {
    fontSize: 28.5,
    lineHeight: 38.5
  }
});
