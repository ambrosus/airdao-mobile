import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heading: {
    textAlign: 'center'
  },
  container: {
    paddingHorizontal: scale(24)
  },
  filters: {
    rowGap: verticalScale(24),
    marginBottom: verticalScale(32)
  },
  button: {
    width: '45%',
    height: 45
  }
});
