import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(18),
    paddingHorizontal: scale(16),
    rowGap: 16
  },
  heading: {
    marginTop: verticalScale(16),
    textAlign: 'center'
  },
  innerContainer: {
    rowGap: 16
  },
  bondsRowGap: {
    columnGap: 4
  },
  button: {
    paddingVertical: 12,
    marginTop: 20
  }
});
