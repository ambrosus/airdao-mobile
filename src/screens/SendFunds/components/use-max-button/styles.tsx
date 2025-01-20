import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.alphaBlack5,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 1000,
    alignSelf: 'baseline'
  }
});
