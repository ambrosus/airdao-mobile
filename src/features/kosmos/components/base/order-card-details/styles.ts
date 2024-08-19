import { verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  innerRowContainer: {
    columnGap: 6
  },
  innerDetailsContainer: {
    rowGap: 10,
    marginTop: verticalScale(18)
  }
});
