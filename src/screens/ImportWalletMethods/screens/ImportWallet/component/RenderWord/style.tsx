import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  main: {
    marginBottom: verticalScale(16),
    columnGap: scale(16)
  },
  container: {
    flex: 1,
    width: '100%'
  }
});
