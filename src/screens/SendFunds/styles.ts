import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingVertical: verticalScale(24),
    position: 'relative'
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(32)
  },
  horizontalPadding: {
    paddingHorizontal: scale(16)
  },

  addressError: {
    marginTop: verticalScale(2),
    marginLeft: scale(4)
  }
});
