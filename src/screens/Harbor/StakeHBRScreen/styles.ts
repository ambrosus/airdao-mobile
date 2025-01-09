import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  justifyContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    backgroundColor: COLORS.neutral50
  },
  footer: {
    paddingHorizontal: scale(16)
  }
});
