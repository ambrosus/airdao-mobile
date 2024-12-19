import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { contentBox } from '@components/styles';

export const styles = StyleSheet.create({
  main: {
    ...contentBox,
    backgroundColor: COLORS.neutral0,
    padding: scale(16)
  },
  topText: {
    fontSize: scale(14)
  },
  bottomText: {
    fontSize: scale(12)
  },
  infoMain: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(10)
  },
  infoTitleText: {
    color: COLORS.neutral600,
    fontSize: scale(14)
  },
  intoText: {
    color: COLORS.neutral900,
    fontSize: scale(14)
  },
  aprText: {
    color: COLORS.success500
  }
});