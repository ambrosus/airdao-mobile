import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  innerContainer: {
    marginHorizontal: scale(16.5)
  },
  inputWithHeadingContainer: {
    marginTop: 16,
    rowGap: 8
  },
  balance: {
    marginTop: verticalScale(8)
  },
  details: {
    marginTop: verticalScale(24),
    rowGap: 8
  }
});
