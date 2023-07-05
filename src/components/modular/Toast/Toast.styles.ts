import { moderateScale, scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

export const styles = StyleSheet.create({
  containerStyle: {
    width: '95%',
    borderRadius: moderateScale(13),
    backgroundColor: COLORS.egyptianGreen,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: verticalScale(12),
    paddingLeft: scale(16)
  }
});
