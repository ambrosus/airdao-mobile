import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  icon: {
    height: moderateScale(32),
    width: moderateScale(32),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center'
  }
});
