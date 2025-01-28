import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'flex-end',
    height: '100%'
  },
  animationContainer: {
    top: 0,
    position: 'absolute',
    height: '70%',
    width: '100%'
  },
  textContainer: { alignItems: 'center' },
  welcomeText: {
    fontSize: verticalScale(28),
    color: COLORS.neutral800,
    fontFamily: 'Inter_700Bold'
  },
  airDaoText: {
    color: COLORS.brand600
  },
  infoText: { fontSize: verticalScale(16) },
  buttons: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(26)
  }
});
