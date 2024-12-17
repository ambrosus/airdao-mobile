import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  innerContainer: {
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(16)
  }
});
