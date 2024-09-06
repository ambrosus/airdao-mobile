import { isAndroid } from '@utils/isPlatform';
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
    lineHeight: isAndroid ? moderateScale(29) : 0,
    fontFamily: 'Rationell_700Bold',
    paddingLeft: 0,
    paddingRight: 0
  }
});
