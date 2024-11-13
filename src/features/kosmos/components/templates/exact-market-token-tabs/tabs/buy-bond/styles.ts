import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  innerContainer: {
    height: 'auto',
    marginHorizontal: scale(16.5)
  },
  zIndex: { zIndex: 0 },
  inputWithHeadingContainer: {
    marginTop: 16
  },
  balance: {
    marginTop: verticalScale(8)
  },
  details: {
    marginTop: verticalScale(24),
    rowGap: 8
  },
  inputButton: {
    width: '100%',
    height: 60,
    position: 'absolute',
    top: 15,
    zIndex: 100
  }
});
