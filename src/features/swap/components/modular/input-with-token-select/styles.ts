import { moderateScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  upperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    width: '60%',
    borderWidth: 0,
    fontSize: moderateScale(29),
    fontFamily: 'Rationell_700Bold',
    paddingLeft: 0.5,
    paddingRight: 0.5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  inputAndroidSpecified: {
    fontSize: 28.5,
    lineHeight: 38.5
  }
});
