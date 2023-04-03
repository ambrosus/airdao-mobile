import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#484848',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(30)
  },
  balance: {
    marginTop: verticalScale(6)
  },

  logo: {
    flex: 1,
    alignItems: 'flex-end'
  },
  logoEllipseInner: {
    borderRadius: scale(35),
    backgroundColor: '#FFFFFF',
    width: scale(70),
    height: scale(70),
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoEllipseMiddle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(45),
    width: scale(90),
    height: scale(90)
  },
  logoEllipseOuter: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(55),
    width: scale(110),
    height: scale(110)
  }
});
