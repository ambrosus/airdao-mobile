import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  heading: {
    marginTop: verticalScale(16),
    textAlign: 'center'
  },
  container: {
    paddingHorizontal: scale(16)
  },
  innerContainer: {
    rowGap: verticalScale(14),
    marginTop: verticalScale(18)
  },
  bondsRowGap: {
    columnGap: 4
  }
});
