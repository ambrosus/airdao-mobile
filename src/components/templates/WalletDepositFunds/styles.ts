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
    width: scale(DEVICE_WIDTH / 2.5),
    height: verticalScale(65),
    objectFit: 'fill'
  },
  description: {
    maxWidth: 313,
    textAlign: 'center',
    letterSpacing: -0.3
  },
  button: {
    width: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'rgba(53, 104, 221, 0.50)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6
  },
  receiveFunds: {
    paddingHorizontal: scale(24)
  }
});
