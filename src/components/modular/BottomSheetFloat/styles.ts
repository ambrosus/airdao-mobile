import { StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@utils';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(32),
    borderRadius: moderateScale(32)
  }
});
