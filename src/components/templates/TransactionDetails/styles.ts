import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: verticalScale(77)
  },
  shareBtn: {
    backgroundColor: COLORS.alphaBlack5,
    paddingVertical: verticalScale(12.5)
  }
});
