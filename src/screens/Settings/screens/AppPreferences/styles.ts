import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    rowGap: verticalScale(8)
  },
  inner: {
    rowGap: verticalScale(8),
    paddingHorizontal: scale(18)
  }
});
