import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
import { DEVICE_WIDTH } from '@constants/variables';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: verticalScale(24)
  },

  thumbnail: {
    width: scale(DEVICE_WIDTH / 2),
    height: verticalScale(87),
    objectFit: 'fill'
  },
  description: {
    maxWidth: 250,
    textAlign: 'center',
    letterSpacing: -0.3
  }
});
