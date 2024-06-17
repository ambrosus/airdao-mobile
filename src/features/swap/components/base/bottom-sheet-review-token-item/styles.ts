import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: scale(131.5),
    padding: 8,
    alignItems: 'center',
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.alphaBlack5
  }
});
