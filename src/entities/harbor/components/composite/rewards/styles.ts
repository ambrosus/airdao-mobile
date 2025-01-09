import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { moderateScale, scale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    padding: scale(12),
    backgroundColor: COLORS.neutral0,
    borderRadius: moderateScale(16)
  },
  rightRowContainer: {
    columnGap: 3
  }
});
