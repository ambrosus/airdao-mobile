import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(8)
  },
  heading: {
    alignSelf: 'center'
  },
  description: {
    textAlign: 'center',
    letterSpacing: -0.31
  },
  secondaryButton: {
    marginTop: verticalScale(8),
    backgroundColor: '#E9EFFB'
  }
});
