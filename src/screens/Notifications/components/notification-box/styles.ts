import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#D8DAE0',
    borderRadius: verticalScale(16),
    padding: scale(12)
  },
  innerContainer: {
    flex: 1
  },
  changeInfoContainer: {
    alignItems: 'center'
  },
  baseText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: COLORS.neutral800,
    letterSpacing: -0.31,
    fontStyle: 'normal'
  },
  baseTextSecondary: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: COLORS.neutral500,
    letterSpacing: -0.31,
    fontStyle: 'normal'
  }
});
