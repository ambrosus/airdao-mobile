import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.neutral0,
    borderRadius: 16,
    padding: scale(16)
  },
  topText: {
    fontSize: 14
  },
  bottomText: {
    fontSize: 12
  },
  infoMain: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 16,
    padding: scale(10)
  },
  infoTitleText: {
    color: COLORS.neutral600,
    fontSize: 14
  },
  intoText: {
    color: COLORS.neutral900,
    fontSize: 14
  },
  aprText: {
    color: COLORS.success500
  }
});
