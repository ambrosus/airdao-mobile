import { verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formWithLabel: {
    rowGap: 8
  },
  relative: {
    position: 'relative'
  },
  percentage: {
    position: 'absolute',
    top: verticalScale(12)
  }
});
