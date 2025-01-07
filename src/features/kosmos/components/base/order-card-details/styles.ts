import { StyleSheet } from 'react-native';
import { verticalScale } from '@utils';

export const styles = StyleSheet.create({
  innerRowContainer: {
    columnGap: 6
  },
  innerDetailsContainer: {
    rowGap: 10,
    marginTop: verticalScale(18)
  }
});
