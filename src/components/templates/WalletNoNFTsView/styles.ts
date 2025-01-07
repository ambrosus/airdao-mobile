import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1
  },
  container: {
    width: '100%',
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: verticalScale(24)
  },

  thumbnail: {
    width: scale(188),
    height: verticalScale(87),
    objectFit: 'contain'
  },
  description: {
    maxWidth: '80%',
    textAlign: 'center',
    letterSpacing: -0.3
  }
});
