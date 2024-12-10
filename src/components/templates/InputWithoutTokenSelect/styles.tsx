import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral0,
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: 16
  },
  selectorWrapper: {
    backgroundColor: COLORS.neutral100,
    padding: scale(5),
    borderRadius: 50
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
