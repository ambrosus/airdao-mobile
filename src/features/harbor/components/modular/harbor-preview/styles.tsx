import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(18),
    paddingHorizontal: scale(8),
    rowGap: 16,
    marginHorizontal: scale(10)
  }
});
