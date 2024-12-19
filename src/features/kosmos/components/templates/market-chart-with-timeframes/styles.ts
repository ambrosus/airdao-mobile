import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 1000
  },
  rowHelperContainer: {
    columnGap: scale(32),
    marginTop: verticalScale(24)
  },
  innerRowContainer: {
    columnGap: 8
  }
});
