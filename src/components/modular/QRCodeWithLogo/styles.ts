import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  logo: {
    backgroundColor: COLORS.neutral0,
    position: 'absolute',
    alignSelf: 'center',

    height: verticalScale(56),
    width: verticalScale(56),
    borderRadius: verticalScale(16),
    padding: moderateScale(6)
  },
  logoInner: {
    backgroundColor: COLORS.brand600,
    height: '100%',
    width: '100%',
    borderRadius: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
