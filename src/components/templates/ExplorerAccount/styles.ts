import { scale, verticalScale } from '@utils/scaling';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  actionButton: {
    paddingVertical: verticalScale(4),
    paddingLeft: scale(12),
    paddingRight: scale(7.5),
    alignSelf: 'flex-start',
    minHeight: verticalScale(24)
  }
});
