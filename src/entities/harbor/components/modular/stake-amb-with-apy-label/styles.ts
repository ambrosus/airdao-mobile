import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    paddingBottom: 2,
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(22, 199, 132, 1)'
  },
  button: {
    flex: 1,
    height: 48
  },
  footer: {
    columnGap: scale(8)
  },
  stakedNativeInnerDetails: {
    padding: scale(12),
    backgroundColor: 'rgba(88, 94, 119, 0.08)',
    borderRadius: moderateScale(12),
    rowGap: verticalScale(12)
  }
});
