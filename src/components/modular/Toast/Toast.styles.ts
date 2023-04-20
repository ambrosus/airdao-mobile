import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  containerStyle: {
    width: '95%',
    borderRadius: moderateScale(13),
    backgroundColor: '#0E0E0E',
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: verticalScale(12),
    paddingLeft: scale(16),
    paddingRight: scale(20)
  }
});
