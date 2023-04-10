import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(18)
  },
  content: {
    paddingHorizontal: scale(28),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    width: '100%',
    position: 'absolute',
    bottom: verticalScale(60)
  },
  button: {
    paddingVertical: verticalScale(12),
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: verticalScale(22),
    left: scale(22)
  }
});
