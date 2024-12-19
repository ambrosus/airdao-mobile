import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: scale(16)
  },
  upperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(8),
    columnGap: 4
  },
  inputContainer: {
    flex: 1
  },
  input: {
    width: '100%',
    borderWidth: 0,
    fontSize: moderateScale(22),
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 0.5,
    paddingVertical: 0
  },
  inputAndroidSpecified: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(29.75)
  }
});
