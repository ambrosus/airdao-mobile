import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils/scaling';
export const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingBottom: '40%'
  },
  spinner: {
    marginTop: verticalScale(16)
  }
});
