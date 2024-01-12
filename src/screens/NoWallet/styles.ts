import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttons: {
    flex: 1,
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(26)
  }
});
