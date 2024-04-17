import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  percentageBox: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 1000
  }
});
