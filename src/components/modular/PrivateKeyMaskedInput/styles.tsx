import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    height: 90,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(12),
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'left',
    verticalAlign: 'top'
  }
});
