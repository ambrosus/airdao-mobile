import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  heading: {
    marginTop: verticalScale(16),
    textAlign: 'center'
  },
  container: {
    marginBottom: verticalScale(50),
    paddingHorizontal: scale(24)
  },
  innerContainer: {
    rowGap: 16,
    marginTop: 16
  },
  bondsRowGap: {
    columnGap: 4
  }
});
