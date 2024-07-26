import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(50),
    paddingHorizontal: scale(24)
  },
  heading: {
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
