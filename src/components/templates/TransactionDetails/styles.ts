import { verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: verticalScale(77)
  },
  shareBtn: {
    backgroundColor: '#0e0e0e0d',
    paddingVertical: verticalScale(12.5)
  }
});
