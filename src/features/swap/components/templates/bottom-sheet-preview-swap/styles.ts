import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(24)
  },
  heading: {
    textAlign: 'center'
  }
});
