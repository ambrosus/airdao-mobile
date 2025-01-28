import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: scale(16),
    paddingRight: scale(18)
  },
  actionButton: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    alignSelf: 'flex-start',
    minHeight: verticalScale(24)
  }
});
