import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.neutral0,
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: 16
  },
  errorWrap: {
    borderWidth: scale(1),
    borderColor: COLORS.error500
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
  },
  button: { padding: scale(2) },
  exchangeMain: {
    position: 'relative',
    height: scale(10),
    zIndex: 1,
    alignItems: 'center'
  },
  exchangeContainerIcon: {
    padding: scale(10),
    top: -16,
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.neutral0,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    position: 'absolute'
  },
  exchangeRate: {
    backgroundColor: COLORS.neutral0,
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: 16
  },
  touchableHandler: {
    width: '100%',
    height: 60,
    position: 'absolute',
    top: 15,
    zIndex: 100
  }
});
