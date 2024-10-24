import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: '100%'
  },
  buttons: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(26)
  }
});
