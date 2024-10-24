import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: verticalScale(24)
  },

  thumbnail: {
    width: scale(157),
    height: verticalScale(65),
    objectFit: 'scale-down'
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
    paddingBottom: verticalScale(56),
    paddingHorizontal: scale(24)
  }
});
