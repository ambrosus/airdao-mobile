import { StyleSheet } from 'react-native';
import { scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  status: {
    paddingHorizontal: scale(8),
    borderRadius: 1000,
    minHeight: verticalScale(24),
    borderWidth: 0.5
  },

  detailsContainer: {
    paddingTop: verticalScale(16),
    rowGap: 16
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: verticalScale(16)
  }
});
