import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(18),
    paddingHorizontal: scale(16),
    rowGap: 16
  },

  innerContainer: {
    rowGap: 16
  },
  bondsRowGap: {
    columnGap: 4
  }
});
