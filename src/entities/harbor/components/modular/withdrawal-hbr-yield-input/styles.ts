import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    borderRadius: moderateScale(16)
  },
  lockIcon: {
    position: 'absolute',
    top: 4
  },
  footer: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
