import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  list: {
    flexGrow: 1,
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(126)
  }
});
