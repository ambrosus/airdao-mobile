import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingTop: 16
  },
  details: {
    marginTop: verticalScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    borderRadius: 16,
    backgroundColor: 'rgba(88, 94, 119, 0.08)',
    rowGap: verticalScale(16)
  },
  footer: {
    marginTop: verticalScale(12)
  }
});
