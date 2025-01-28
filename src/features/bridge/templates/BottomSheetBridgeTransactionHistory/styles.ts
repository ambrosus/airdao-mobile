import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: verticalScale(16),
    paddingHorizontal: scale(24)
  },
  innerContainer: {
    gap: verticalScale(16)
  },
  heading: {
    textAlign: 'center'
  },
  tokenRow: {
    gap: 4
  },
  amountRow: {
    gap: 8
  }
});
