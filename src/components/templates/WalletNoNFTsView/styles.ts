import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '80%',
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
